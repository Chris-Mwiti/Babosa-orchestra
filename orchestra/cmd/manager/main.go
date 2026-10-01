// Command manager runs the Babosa control-plane process: scheduler loop,
// worker reconciliation loop, and manager HTTP API. It talks to workers
// over HTTP only and shares no memory with them, so it can run on a
// completely different host/process from any worker.
//
// Usage:
//
//	BABOSA_MANAGER_HOST=0.0.0.0 BABOSA_MANAGER_PORT=8080 BABOSA_WORKERS=10.0.0.11:8081,10.0.0.12:8081 go run ./cmd/manager
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"

	"github.com/joho/godotenv"

	"github.com/Chris-Mwiti/build-your-own-x/go_projects/orchestra/manager"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Printf("no .env file found (%v), falling back to defaults\n", err)
	}
}

func envOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envPortOrDefault(key string, fallback int) int {
	v, err := strconv.Atoi(os.Getenv(key))
	if err != nil || v == 0 {
		return fallback
	}
	return v
}

// workersFromEnv resolves the worker pool. BABOSA_WORKERS (comma-separated
// host:port list) takes precedence; otherwise we fall back to the legacy
// single-worker BABOSA_WORKERS_HOST/_PORT pair so old .env files keep working.
func workersFromEnv() []string {
	if list := os.Getenv("BABOSA_WORKERS"); list != "" {
		var out []string
		for _, w := range strings.Split(list, ",") {
			if w = strings.TrimSpace(w); w != "" {
				out = append(out, w)
			}
		}
		if len(out) > 0 {
			return out
		}
	}
	host := envOrDefault("BABOSA_WORKERS_HOST", "localhost")
	port := envPortOrDefault("BABOSA_WORKERS_PORT", 8081)
	return []string{fmt.Sprintf("%s:%d", host, port)}
}

func main() {
	host := envOrDefault("BABOSA_MANAGER_HOST", "localhost")
	port := envPortOrDefault("BABOSA_MANAGER_PORT", 8080)
	workers := workersFromEnv()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	mg := manager.New(workers)

	// Reconciliation + dispatch loops (in-process goroutines).
	go mg.Process()
	go mg.ListenToUpdates(ctx)

	mngApi := manager.ManagerApi{
		Port:    port,
		Address: host,
		Manger:  mg,
	}

	log.Printf("manager listening on %s:%d with %d worker(s): %v\n", host, port, len(workers), workers)
	// Blocking: owns the process. Shut down via SIGINT/SIGTERM.
	mngApi.Start()
}
