# DevOps Infrastructure Project

### Infrastructure as Code with Terraform + Azure + Docker + CI/CD

[![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Microsoft Azure](https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://www.linux.org/)
[![Bash](https://img.shields.io/badge/Bash-121011?style=for-the-badge&logo=gnubash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

---

## About

This is a hands-on DevOps learning project with **Terraform as the main focus**.

The main goal was to understand how cloud infrastructure can be defined as code and then used together with Docker and CI/CD.

The application itself is intentionally small. The application exists mainly to provide something that can be containerized and deployed while learning infrastructure and automation.

The main learning path was:

```text
Terraform
    │
    ▼
Azure Infrastructure
    │
    ├── Resource Group
    ├── Virtual Network
    ├── Subnet
    ├── Network Security Group
    ├── Public IP
    ├── Network Interface
    └── Linux Virtual Machine
              │
              ▼
           Docker
              │
        ┌─────┴─────┐
        ▼           ▼
    Frontend     Backend
      :3000        :8080
              │
              ▼
        GitHub Actions
              │
              ▼
             CI/CD
```

---

# Main Focus: Terraform

## Why Terraform?

One of the main things I wanted to learn in this project was **Infrastructure as Code**.

Instead of manually creating every Azure resource through the Azure Portal:

```text
Azure Portal
     │
     ├── Create Resource Group
     ├── Create VNet
     ├── Create Subnet
     ├── Create NSG
     ├── Add Security Rules
     ├── Create Public IP
     ├── Create NIC
     └── Create VM
```

Terraform allows the infrastructure to be described in code:

```text
terraform/main.tf
        │
        ▼
     Terraform
        │
        ▼
      Azure
```

The main concept learned was:

> Infrastructure can be defined as code, reviewed before deployment, and managed using Terraform.

---

# Terraform Architecture

The Terraform configuration created the following infrastructure:

```text
                    Terraform
                        │
                        ▼
              ┌──────────────────┐
              │    AzureRM       │
              │     Provider     │
              └────────┬─────────┘
                       │
                       ▼
              Resource Group
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
      VNet            NSG          Public IP
        │              │
        ▼              ▼
     Subnet       Security Rules
        │
        ▼
       NIC
        │
        ▼
   Linux VM
```

---

# Terraform Provider

Terraform uses providers to communicate with external platforms.

For this project, the AzureRM provider was used:

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

Conceptually:

```text
Terraform
    │
    │ AzureRM Provider
    ▼
Microsoft Azure
```

The provider gives Terraform the ability to create and manage Azure resources.

---

# Terraform Resources

The project used Terraform resources for:

```text
Resource Group
      │
      ├── Virtual Network
      │       │
      │       └── Subnet
      │
      ├── Network Security Group
      │       ├── SSH : 22
      │       └── Frontend : 3000
      │
      ├── Public IP
      │
      ├── Network Interface
      │
      └── Linux Virtual Machine
```

For example:

```hcl
resource "azurerm_resource_group" "main" {
  name     = "devops-infrastructure-rg"
  location = "Central India"
}
```

The important concept here is **desired state**.

The Terraform configuration describes what infrastructure should exist.

---

# Terraform Workflow

The basic Terraform workflow practiced in this project was:

```text
main.tf
   │
   ▼
terraform init
   │
   ▼
terraform validate
   │
   ▼
terraform plan
   │
   ▼
terraform apply
   │
   ▼
Azure Infrastructure
```

## 1. Initialize

```bash
terraform init
```

This initializes the Terraform directory and downloads the required provider.

---

## 2. Validate

```bash
terraform validate
```

This checks whether the Terraform configuration is valid.

---

## 3. Plan

```bash
terraform plan
```

This shows what Terraform intends to create or change.

Conceptually:

```text
main.tf
   │
   ▼
terraform plan
   │
   ▼
Review proposed infrastructure changes
```

This is important because infrastructure changes can be reviewed before they are applied.

---

## 4. Apply

```bash
terraform apply
```

This applies the configuration and creates the infrastructure in Azure.

---

# Terraform State

Another important concept learned was **Terraform state**.

Terraform needs to keep track of infrastructure that it manages.

Conceptually:

```text
Terraform Configuration
          │
          ▼
    Desired State
          │
          │ compare
          ▼
   Terraform State
          │
          ▼
   Actual Infrastructure
```

Terraform state files and the `.terraform` directory were excluded from Git through `.gitignore`.

The purpose was to understand the basic relationship between:

- Configuration
- State
- Actual infrastructure

---

# Azure Infrastructure

Terraform created the Azure infrastructure required for the project.

The main resources were:

| Resource               | Purpose                        |
| ---------------------- | ------------------------------ |
| Resource Group         | Holds the Azure resources      |
| Virtual Network        | Provides the network           |
| Subnet                 | Network segment for the VM     |
| Network Security Group | Controls network access        |
| Network Security Rules | Controls allowed ports         |
| Public IP              | Provides public access         |
| Network Interface      | Connects the VM to the network |
| Linux VM               | Hosts the application          |

The VM used during development was:

- Ubuntu 22.04
- Standard B1s
- 1 vCPU
- Approximately 1 GiB memory
- Central India

### Azure VM

![Azure VM created through Terraform](docs/images/azure_vm.png)

The VM shown here was created as part of the Terraform-managed infrastructure.

> The VM was later deleted after completing the project so that unnecessary cloud resources were not left running.

---

# Azure Networking

Terraform also created the networking required by the VM.

```text
Azure
│
└── Resource Group
    │
    └── Virtual Network
        │
        └── Subnet
            │
            └── Network Interface
                    │
                    ▼
                   VM
```

The Network Security Group contained rules for:

```text
Port 22
   │
   └── SSH

Port 3000
   │
   └── Frontend
```

The backend used port `8080`, but it was not publicly allowed through the Azure Network Security Group.

This helped me understand an important distinction:

```text
Docker Port Mapping
        ≠
Azure Network Access
```

A container can expose a port while the cloud network can still block public access to that port.

---

# Docker

Docker was used to containerize the application services.

The project contains:

```text
backend/
    └── Dockerfile

frontend/
    └── Dockerfile
```

The Dockerfiles use Node.js Alpine images and install the application dependencies inside the containers.

The concepts practiced included:

- Docker images
- Docker containers
- Dockerfiles
- Image building
- Container startup
- Port mapping
- Container logs
- Container resource usage

---

# Docker Compose

Docker Compose was used to manage both services together.

```text
Docker Compose
      │
      ├── Frontend
      │     └── :3000
      │
      └── Backend
            └── :8080
```

The services were defined in:

```text
docker-compose.yml
```

The complete application could then be started with:

```bash
docker compose up -d
```

or rebuilt with:

```bash
docker compose up -d --build
```

---

# Linux and SSH

After Terraform created the VM, I connected to it using SSH.

A dedicated project SSH key was used for the infrastructure project.

The workflow was:

```text
Terraform
   │
   └── Creates VM with public SSH key
                    │
                    ▼
                  SSH
                    │
                    ▼
              Ubuntu VM
                    │
                    ▼
                 Docker
```

Some of the commands practiced on the VM were:

```bash
docker ps
docker logs
docker stats --no-stream
docker compose up -d
docker compose up -d --build
curl
free -h
df -h
uptime
```

---

# Deployment Script

A simple deployment script was created:

```text
deploy.sh
```

The script:

```bash
#!/bin/bash

set -e

echo "Starting deployment..."

git pull origin main

docker compose up -d --build

echo "Deployment completed successfully."
```

The purpose was to keep the deployment process simple and predictable.

GitHub Actions could connect to the VM and execute:

```text
./deploy.sh
```

instead of having every deployment command written directly inside the workflow.

---

# GitHub Actions

After the infrastructure and application were working, GitHub Actions was used to automate deployment.

The workflow was:

```text
git push
   │
   ▼
GitHub Actions
   │
   ▼
Checkout repository
   │
   ▼
SSH into Azure VM
   │
   ▼
./deploy.sh
   │
   ├── git pull
   │
   └── docker compose up -d --build
   │
   ▼
Backend health check
   │
   ▼
Deployment result
```

---

# CI/CD

The project helped me understand the practical flow of CI/CD.

```text
Code Change
     │
     ▼
Git Commit
     │
     ▼
Git Push
     │
     ▼
GitHub
     │
     ▼
GitHub Actions
     │
     ▼
SSH
     │
     ▼
Azure VM
     │
     ▼
Docker Compose
     │
     ▼
Updated Application
```

A frontend message was changed during development to verify that a Git push could travel through the entire deployment pipeline.

### Application After Deployment

![Application deployed through CI/CD](docs/images/deployment-1.png)

The application displayed:

```text
Infrastructure Project

Frontend is on port 3000 and deployed by CI/CD
```

---

# Health Checks

The backend contains a health endpoint:

```text
GET /health
```

The response is:

```json
{
  "status": "ok"
}
```

GitHub Actions checks this endpoint after deployment.

The purpose is to verify that the backend is actually responding instead of only checking whether the deployment command completed.

---

# The Failure

The project was not completed successfully on the first attempt.

The first health-check implementation resulted in a **red GitHub Actions run**.

![Failed GitHub Actions run](docs/images/error.png)

This was useful because the failure showed that the deployment process still had a problem that needed to be investigated.

The important part was not simply getting a green check.

The important part was understanding **why it failed**.

---

# Debugging the Health Check

The first health check used HTTPS:

```bash
curl -f https://localhost:8080/health
```

However, the backend was running over HTTP.

The correct request was:

```bash
curl -f http://localhost:8080/health
```

After correcting that, another issue became visible.

The backend sometimes needed a few seconds to become ready after Docker rebuilt and restarted the container.

Therefore, checking the endpoint only once immediately after deployment could still fail.

---

# Adding Retry Logic

Instead of removing the health check, the workflow was improved to retry.

The final logic was:

```text
Deploy
   │
   ▼
Check /health
   │
   ├── Healthy
   │      │
   │      ▼
   │    Success
   │
   └── Not ready
          │
          ▼
       Wait 3s
          │
          ▼
       Try again
          │
          ▼
       Continue
```

This taught me an important practical DevOps concept:

> A container being started does not necessarily mean that the application inside it is immediately ready to accept requests.

---

# From Red to Green

The learning process looked like:

```text
First Attempt
     │
     ▼
   RED
     │
     ▼
Read GitHub Actions logs
     │
     ▼
Find HTTPS / HTTP issue
     │
     ▼
Fix health check
     │
     ▼
Find startup/readiness issue
     │
     ▼
Add retry logic
     │
     ▼
Run again
     │
     ▼
  GREEN
```

### Successful Deployment

![Successful GitHub Actions deployment](docs/images/github_action.png)

This successful run confirmed that the deployment workflow was working after the fixes.

---

# GitHub Actions Run History

The GitHub Actions history is part of the learning process.

There was a failed run:

```text
Failed health-check deployment
        │
        ▼
Investigated
        │
        ▼
Fixed
        │
        ▼
Successful deployment
```

The red run was not hidden or removed.

It demonstrates that the project involved actual debugging rather than simply documenting a workflow that worked perfectly on the first attempt.

---

# Other Small Mistakes and Fixes

There were also smaller problems during the project.

### Dockerfile syntax

A Dockerfile command initially contained a syntax issue.

The problem was identified while building the image and corrected before continuing.

### Container startup

The backend and frontend containers were tested individually before being combined through Docker Compose.

This helped isolate problems instead of debugging multiple layers at the same time.

### HTTP vs HTTPS

The health check initially used:

```text
https://localhost:8080
```

while the backend was serving:

```text
http://localhost:8080
```

The request was corrected.

### Service readiness

The backend could take a few seconds to become available after a rebuild.

The health check was therefore changed from a single check to retry-based checking.

### Azure Networking

Testing the application also helped clarify the difference between:

```text
Docker port publishing
```

and:

```text
Azure Network Security Group rules
```

These were useful mistakes because each one helped connect the different layers of the system.

---

# GitHub Actions Secrets

Sensitive deployment information was stored using GitHub repository secrets.

The configured secrets were:

```text
VM_HOST
VM_USER
VM_SSH_KEY
```

### Repository Secrets

![GitHub Actions repository secrets](docs/images/secret_screen.png)

The private SSH key itself was not committed to the repository.

---

# Monitoring the VM

After deployment, basic system and container resource usage was checked.

Commands used included:

```bash
free -h
df -h
uptime
docker stats --no-stream
```

These helped inspect:

- Memory usage
- Available memory
- Disk usage
- CPU/load
- Container memory usage
- Container CPU usage
- Network I/O
- Container process count

Example container monitoring was performed using:

```bash
docker stats --no-stream
```

---

# Project Structure

```text
devops_infrastructure_project/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── terraform/
│   ├── main.tf
│   └── .terraform.lock.hcl
│
├── docs/
│   └── images/
│       ├── azure_vm.png
│       ├── deployment-1.png
│       ├── deployment.png
│       ├── error.png
│       ├── github_action-1.png
│       ├── github_action.png
│       └── secret_screen.png
│
├── docker-compose.yml
├── deploy.sh
├── .gitignore
└── README.md
```

Terraform working directories and state files are intentionally excluded from Git.

---

# Technologies

[![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Microsoft Azure](https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://www.linux.org/)
[![Bash](https://img.shields.io/badge/Bash-121011?style=for-the-badge&logo=gnubash&logoColor=white)](https://www.gnu.org/software/bash/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

| Technology      | Role                            |
| --------------- | ------------------------------- |
| Terraform       | Infrastructure as Code          |
| Microsoft Azure | Cloud infrastructure            |
| Docker          | Containerization                |
| Docker Compose  | Multi-container deployment      |
| GitHub Actions  | CI/CD automation                |
| Ubuntu Linux    | Cloud VM operating system       |
| SSH             | Remote server access            |
| Bash            | Deployment scripting            |
| Node.js         | Application runtime             |
| Express.js      | Small frontend/backend services |
| Git             | Version control                 |
| GitHub          | Source code hosting             |

---

# What I Actually Learned

The main learning outcome was **not** building the Node.js application.

The main goal was understanding how different DevOps tools connect together.

The project connected:

```text
Infrastructure as Code
        │
        ▼
    Terraform
        │
        ▼
      Azure
        │
        ▼
    Linux VM
        │
        ▼
      Docker
        │
        ▼
 Docker Compose
        │
        ▼
 GitHub Actions
        │
        ▼
      CI/CD
```

---

# Terraform Learning

The most important Terraform concepts learned were:

- Providers
- Resources
- Desired state
- Terraform state
- Infrastructure as Code
- Resource dependencies
- `terraform init`
- `terraform validate`
- `terraform plan`
- `terraform apply`

The project helped me understand that Terraform is essentially a way to describe infrastructure in code and let Terraform handle creating and managing that infrastructure.

---

# Cloud Learning

The Azure concepts practiced were:

- Resource Groups
- Virtual Networks
- Subnets
- Network Security Groups
- Network Security Rules
- Public IP addresses
- Network Interfaces
- Linux Virtual Machines

---

# Container Learning

Docker concepts practiced were:

- Docker images
- Docker containers
- Dockerfiles
- Image builds
- Container ports
- Container logs
- Docker Compose
- Container resource monitoring

---

# Automation Learning

The automation concepts practiced were:

- GitHub Actions
- CI/CD
- SSH-based deployment
- Repository secrets
- Deployment scripts
- Health checks
- Retry logic
- Deployment debugging

---

# Linux Learning

The Linux concepts practiced were:

- SSH access
- Docker administration
- Service testing with `curl`
- Memory inspection
- Disk inspection
- CPU/load inspection
- Container monitoring

---

# Final Architecture

```text
                         GitHub
                           │
                      git push main
                           │
                           ▼
                  ┌─────────────────┐
                  │ GitHub Actions  │
                  └────────┬────────┘
                           │
                          SSH
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                     Azure                           │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                 Linux VM                     │  │
│  │                                               │  │
│  │   ┌───────────────────────────────────────┐   │  │
│  │   │          Docker Compose              │   │  │
│  │   │                                       │   │  │
│  │   │  ┌────────────┐    ┌────────────┐   │   │  │
│  │   │  │ Frontend   │    │  Backend   │   │   │  │
│  │   │  │   :3000    │    │   :8080    │   │   │  │
│  │   │  └────────────┘    └────────────┘   │   │  │
│  │   └───────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Resource Group                                    │
│  VNet → Subnet → NSG → NIC → Public IP → VM       │
└─────────────────────────────────────────────────────┘
                           ▲
                           │
                    Terraform manages
                           │
                    ┌──────┴──────┐
                    │  main.tf    │
                    └─────────────┘
```

---

# Project Status

The project was completed as a learning exercise.

The Azure VM was intentionally deleted after the infrastructure and deployment exercises were completed.

The repository remains as a record of:

- Terraform infrastructure definitions
- Azure infrastructure configuration
- Docker configuration
- Docker Compose configuration
- Linux VM setup
- SSH configuration
- GitHub Actions workflow
- Deployment script
- CI/CD implementation
- Health-check implementation
- Debugging process
- Failed and successful deployment runs
- Project screenshots
- DevOps concepts learned

The project was intentionally kept small so that the main focus remained on:

```text
Terraform
   ↓
Azure
   ↓
Docker
   ↓
GitHub Actions
   ↓
CI/CD
   ↓
Health Checks
   ↓
Debugging
```

---

# Key Takeaway

The biggest lesson from this project was that DevOps is not just about knowing individual tools.

It is about understanding how the tools work together.

```text
Terraform
    │
    │ Creates infrastructure
    ▼
Azure
    │
    │ Hosts the VM
    ▼
Linux
    │
    │ Runs containers
    ▼
Docker
    │
    │ Runs application
    ▼
GitHub Actions
    │
    │ Automates deployment
    ▼
CI/CD
    │
    │ Verifies deployment
    ▼
Health Check
```

And when something fails:

```text
Failure
   │
   ▼
Read the logs
   │
   ▼
Understand the problem
   │
   ▼
Fix the configuration
   │
   ▼
Run again
   │
   ▼
Success
```

That debugging cycle was an important part of the project.

---

## Next Learning Direction

The next project should introduce a genuinely new DevOps concept rather than simply repeating the same Docker + Azure VM + basic CI/CD workflow.

Possible next areas include:

- Kubernetes
- Container orchestration
- Advanced CI/CD
- Monitoring and observability
- Further Infrastructure as Code
