# Babosa Orchestra 🪐

A minimal, custom-built toy container orchestration engine written in Go. Designed to demystify the core mechanics of distributed container runtimes, scheduler loops, state synchronization, and cluster consensus without relying on heavy production frameworks.

##  Architectural Overview

Babosa Orchestra mirrors the classic master-worker topology found in systems like Kubernetes or HashiCorp Nomad. The system separates the cluster control plane from active task runners via highly modular Go packages.

```
                    ┌──────────────────────────────┐
                    │       Control Plane          │
                    │   (Manager / API / Scheduler)│
                    └──────────────┬───────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
│  Worker Node 01      ││  Worker Node 02      ││  Worker Node 03      │
│  (Docker Runtime)    ││  (Docker Runtime)    ││  (Docker Runtime)    │
└──────────────────────┐└──────────────────────┐└──────────────────────┐
```

###  Package Breakdown

*   **`task/`**: The atomic unit of execution. Handles the task life cycle states (`Pending`, `Scheduled`, `Running`, `Failed`, `Completed`) and serializes application configurations.
*   **`node/`**: Encapsulates resource profiles (CPU, Memory, Disk) and host telemetry data needed to register physical or virtual machines into the cluster pool.
*   **`worker/`**: The boots on the ground. Interacts directly with the Docker API via the official Go SDK to pull images, spawn containers, manage networking bindings, and stream health status back upward.
*   **`manager/`**: The brain of the operation. Tracks the state of all workers, collects metrics, hosts the API interface, and continuously reconciles the cluster's *actual state* with the *desired state*.
*   **`scheduler/`**: Implements load-distribution algorithms (e.g., Round-Robin, Least-Allocated) to determine the optimal node deployment path for unassigned tasks.

---

##  Features

*   **Custom Task State Machine:** Track containers smoothly through their entire life cycle.
*   **Docker SDK Integration:** Low-level container bindings handling isolations, environment variables, and memory caps.
*   **Dynamic Resource Monitoring:** Evaluates node utilization metrics before scheduling work workloads.
*   **Pluggable Scheduler Interface:** Easily swap or test alternative placement paradigms for distributed tasks.

---

## ⚙️ Getting Started

### Prerequisites

*   **Go**: Version 1.22+
*   **Docker Daemon**: Must be running locally or reachable via network socket (e.g., `unix:///var/run/docker.sock`).

### Installation

1. Clone the repository and navigate to the orchestra module:
   ```bash
   git clone https://github.com/Chris-Mwiti/Babosa-orchestra.git
   cd Babosa-orchestra/orchestra
   ```

2. Tidy dependencies:
   ```bash
   go mod tidy
   ```

### Running the Engine

You can initialize a basic simulation main file to spin up an in-memory control manager and local worker runtime:

```bash
go run main.go
```

---

## Usage Example

Tasks are declared programmatically using structural primitives:

```go
package main

import (
	"time"
	"orchestra/task"
	"orchestra/worker"
	"github.com/google/uuid"
)

func main() {
	// 1. Define a workload
	t := task.Task{
		ID:    uuid.New(),
		Name:  "web-server-task",
		State: task.Pending,
		Config: task.Config{
			Image: "nginx:latest",
			Runtime: "docker",
		},
	}

	// 2. Instantiate a worker node tracking your local Docker daemon
	w := worker.NewWorker("worker-node-01")
	
	// 3. Collect host metrics and run the task
	w.CollectStats()
	w.RunTask(t)
}
```

---

## Implementation Roadmap

- [x] Basic Docker task instantiation & runtime management.
- [x] Struct-driven node registration and capacity tracking.
- [ ] Implement persistent state backend (e.g., LevelDB/durable WAL).
- [ ] Introduce distributed consensus protocols for multi-manager resilience.
- [ ] Add overlay networking layer for inter-container communication.

## Contributing

Contributions, issues, and ideas to push this toy engine further into low-level systems engineering are highly welcome. Feel free to open a Pull Request or create an Issue!
