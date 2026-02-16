💰 Budget Tracker
A full-stack expense tracking application designed to help users manage their finances, set monthly category budgets, and visualize spending habits. This project demonstrates a complete DevOps pipeline, utilizing Terraform for Infrastructure as Code (IaC) to provision AWS resources and Docker for containerized deployment.

🚀 Features
Dashboard: View a monthly summary of total spending and spending by category.

Budget Management: Set monthly limits for specific categories (e.g., Food, Transport, Rent).

Visual Indicators: Color-coded progress bars indicate if you are under or over budget for a category.

Expense Logging: Add, edit, and delete daily expenses with descriptions and dates.

Responsive UI: Built with React for a seamless user experience.

🛠 Tech Stack
Frontend
React (v19)

Nginx (Reverse Proxy & Static File Serving)

CSS Modules for styling

Backend
Node.js & Express

Prisma ORM (Database interaction)

PostgreSQL (Relational Database)

DevOps & Infrastructure
AWS (VPC, EC2, RDS, Security Groups)

Terraform (Infrastructure as Code)

Docker & Docker Compose (Containerization)

GitHub Actions (CI/CD Pipeline)

🏗 Architecture
The application is deployed on an AWS EC2 t2.micro instance within a custom VPC.

Frontend: Served via Nginx on port 80. Nginx also acts as a reverse proxy, forwarding API requests to the backend.

Backend: An Express API running on port 3001 (internal).

Database: An AWS RDS PostgreSQL instance located in a private subnet for security.

🏁 Getting Started (Local Development)
Follow these steps to run the application locally on your machine.

Prerequisites
Node.js (v18+)

Docker & Docker Compose

Git

1. Clone the Repository
Bash
git clone https://github.com/Soonyee1346/BudgetTracker.git
cd BudgetTracker
2. Environment Variables
Create a .env file in the expense-tracker-api directory:

Code snippet
# Example for local docker postgres
DATABASE_URL="postgresql://user:password@db:5432/budgettracker?schema=public"
3. Run with Docker Compose
This will spin up the Frontend, Backend, and a local PostgreSQL database.

Bash
docker-compose up --build
Frontend: http://localhost:3000

Backend: http://localhost:3001

☁️ Deployment (Terraform & AWS)
This project uses Terraform to automatically provision the necessary AWS infrastructure.

1. Pre-requisites
AWS CLI installed and configured.

Terraform installed.

An SSH Key Pair generated (ensure budget-deploy-key.pub is placed in terraform/).

2. Provision Infrastructure
Bash
cd terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes (Creates VPC, RDS, EC2, etc.)
terraform apply
Note the ec2_public_ip and rds_endpoint outputs from Terraform.

3. Configuration Setup
Since .env files (containing secrets) and docker-compose.yml are not stored in the git repository, you must copy them to the server securely.

Run these commands from your local machine:

Bash
# 1. Copy docker-compose.yml to the app directory
scp -i terraform/budget-deploy-key docker-compose.yml ubuntu@<EC2_PUBLIC_IP>:~/app/

# 2. Copy the backend .env file (Ensure this file has the Production RDS URL)
scp -i terraform/budget-deploy-key expense-tracker-api/.env ubuntu@<EC2_PUBLIC_IP>:~/app/
4. Initial Launch
SSH into the instance and start the containers:

Bash
ssh -i terraform/budget-deploy-key ubuntu@<EC2_PUBLIC_IP>

cd ~/app
sudo docker-compose pull
sudo docker-compose up -d
🎮 Managing the Application (Docker Commands)
Once deployed, use these commands on the EC2 server to manage the app.

🔄 Updating the App (Deployment)
When you push code to GitHub, the CI/CD pipeline builds new images. To update the running server:

Bash
cd ~/app
sudo docker-compose pull      # Download new images
sudo docker-compose up -d     # Recreate containers with new images
📜 Viewing Logs
To debug issues or see server activity:

Bash
# View all logs (add -f to follow real-time)
sudo docker-compose logs -f

# View only backend logs
sudo docker-compose logs -f backend

# View only frontend (Nginx) logs
sudo docker-compose logs -f frontend
🧹 Maintenance & Cleanup
If the server runs out of space or you need a clean slate:

Bash
# Stop all containers
sudo docker-compose down

# Remove unused images (frees up space)
sudo docker system prune -a -f
🔄 CI/CD Pipeline
This project includes a GitHub Actions workflow defined in .github/workflows/ci.yml.

On Push to Main:

Checks out code.

Builds the Node.js API Docker image.

Builds the React Frontend Docker image.

Pushes both images to GitHub Container Registry (GHCR).

📂 Project Structure
BudgetTracker/
├── expense-tracker-frontend/  # React Application
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── expense-tracker-api/       # Node.js Express API
│   ├── src/
│   ├── prisma/                # Database Schema
│   └── Dockerfile
├── terraform/                 # Infrastructure as Code
│   └── main.tf                # AWS Resource Definitions
└── docker-compose.yml         # Local & Production orchestration
📝 License
This project is licensed under the ISC License.
