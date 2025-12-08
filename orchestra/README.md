# Babosa Orchestra

Babosa is a container orchestration system written in Go, inspired by the book "Build an Orchestrator in Go" by Tim Boring. It is designed to manage and schedule Docker containers across a cluster of worker nodes. This project provides a hands-on look into the core concepts of container orchestration, from task scheduling to worker management and state persistence.

> **Note:** This project is currently in progress. The core functionality is being actively developed and is expected to be completed by the end of the week.

## High-Level Architecture

The architecture of Babosa is composed of two primary components: a **Manager** and one or more **Workers**. They communicate via a REST API.

![Babosa Architecture](https://i.imgur.com/your-architecture-diagram.png) 
*(Diagram to be added)*

-   **Manager**: The central control plane, or the "brain" of the orchestrator.
    -   **Responsibilities**:
        -   Accepting tasks from a user via a REST API.
        -   Scheduling tasks onto available workers using a scheduling algorithm (currently round-robin).
        -   Keeping track of the state of tasks and workers.
        -   Exposing endpoints to view task status and stop tasks.

-   **Worker**: The data plane, or the "muscle" of the orchestrator. It runs on each machine in the cluster.
    -   **Responsibilities**:
        -   Receiving tasks from the Manager.
        -   Interacting with the Docker daemon to run, stop, and inspect containers.
        -   Monitoring its own resources (CPU, Memory, Disk) and reporting stats back to the Manager.
        -   Managing the lifecycle of a task on its node.

-   **Task**: The fundamental unit of work. It represents a Docker container to be run, including its image, resource requirements, and restart policy.

## How to Run a Demo

Here’s how to get a simple demo of the Babosa orchestrator running on your local machine.

### Prerequisites

-   [Go](https://golang.org/dl/) (version 1.23 or later)
-   [Docker](https://docs.docker.com/get-docker/) installed and running.

### 1. Configuration

Create a `.env` file in the root of the `orchestra` directory with the following content. This configures the network addresses for the manager and a single worker.

```env
# Manager API configuration
BABOSA_MANAGER_HOST=localhost
BABOSA_MANAGER_PORT=8080

# Worker API configuration
BABOSA_WORKERS_HOST=localhost
BABOSA_WORKERS_PORT=8081
```

### 2. Run the Orchestrator

Open your terminal in the `Babosa/orchestra` directory and run the main application. This command starts both the Manager and a single Worker process.

```bash
go run main.go
```

You should see log output indicating that the manager and worker servers have started.

### 3. Submit a Task

In a new terminal window, use `curl` to send a POST request to the manager's API to create a new task. This example will schedule an `nginx` container.

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{
    "Task": {
        "Name": "my-nginx-task",
        "Image": "nginx:latest",
        "Memory": 128,
        "Disk": 1,
        "RestartPolicy": "on-failure"
    }
}' http://localhost:8080/manager
```

The manager will respond with the details of the created task, including its newly assigned UUID.

### 4. Check the Task

You can check that the NGINX container is running using the `docker ps` command:

```bash
docker ps
```

You should see the `nginx` container running. The manager will have assigned it a name like `my-nginx-task-<uuid>`.

## Project Structure

-   `/manager`: Contains the logic for the Manager component, including its API handlers and scheduling logic.
-   `/worker`: Contains the logic for the Worker component, responsible for running tasks and collecting stats.
-   `/task`: Defines the core `Task` and `TaskEvent` data structures and includes the Docker client wrapper for container operations.
-   `/node`: Defines the `Node` data structure, representing a machine in the cluster.
-   `/scheduler`: Defines the interface for pluggable scheduling algorithms.
-   `/web_frontend`: A Next.js application that serves as a landing page to showcase the project.
-   `main.go`: The entry point for the application, which initializes and starts the Manager and Worker.
