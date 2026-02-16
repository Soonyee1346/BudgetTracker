# Isloated network
resource "aws_vpc" "budget_tracker_vpc" {
    cidr_block           = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support   = true

    tags = {
        Name = "budget-tracker-vpc"
    }
}

# Internet Gateway - Allows the VPC to talk to the Internet
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.budget_tracker_vpc.id

    tags = {
        Name = "budget-tracker-igw"
    }
}

# Public Subnets. Two subnets in different AZs because RDS requires it.
resource "aws_subnet" "public_1" {
    vpc_id                  = aws_vpc.budget_tracker_vpc.id
    cidr_block              = "10.0.1.0/24"
    availability_zone       = "ap-southeast-2a"
    map_public_ip_on_launch = true

    tags = {
        Name = "budget-tracker-public-1"
    }
}

resource "aws_subnet" "public_2" {
    vpc_id                  = aws_vpc.budget_tracker_vpc.id
    cidr_block              = "10.0.2.0/24"
    availability_zone       = "ap-southeast-2b"
    map_public_ip_on_launch = true

    tags = {
        Name = "budget-tracker-public-2"
    }
}

# Route Table
resource "aws_route_table" "public_rt" {
    vpc_id = aws_vpc.budget_tracker_vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw.id
    }

    tags = {
        Name = "budget-tracker-public-rt"
    }
}

# Associations
resource "aws_route_table_association" "a" {
    subnet_id       = aws_subnet.public_1.id
    route_table_id  = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "b" {
    subnet_id       = aws_subnet.public_2.id
    route_table_id  = aws_route_table.public_rt.id
}

# Security Group for EC2 Instance (Frontend & API)
resource "aws_security_group" "app_sg" {
    name        = "budget-tracker-app-sg"
    description = "Allow web traffic to Budget Tracker"
    vpc_id      = aws_vpc.budget_tracker_vpc.id

    # Inbound: Port 3000 for React Frontend
    ingress {
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Inbound: Port 3001 for Node.js API
    ingress {
        from_port   = 3001
        to_port     = 3001
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Inbound: Port 22 for SSH
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Outbound: Allow everything
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# Security Group for RDS
resource "aws_security_group" "db_sg" {
    name        = "budget-tracker-db-sg"
    description = "Allow API to reach RDS"
    vpc_id      = aws_vpc.budget_tracker_vpc.id

    # Inbound: Only allow traffic from our App Security Group
    ingress {
        from_port       = 5432
        to_port         = 5432
        protocol        = "tcp"
        security_groups = [aws_security_group.app_sg.id]
    }
}

# DB Subnet Group - Tells RDS to use the two public subnets
resource "aws_db_subnet_group" "db_subnet_group" {
    name        = "budget-tracker-db-subnet-group"
    subnet_ids  = [aws_subnet.public_1.id, aws_subnet.public_2.id]

    tags = {
        Name = "budget-tracker-db-subnet-group"
    }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
    allocated_storage    = 20
    db_name              = "budgettracker"
    engine               = "postgres"
    engine_version       = "16"
    instance_class       = "db.t3.micro"
    username             = "postgres"
    password             = "password"
    parameter_group_name = "default.postgres16"
    skip_final_snapshot  = true
    publicly_accessible  = false

    db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name
    vpc_security_group_ids = [aws_security_group.db_sg.id]

    tags = {
        Name = "budget-tracker-db"
    }
}

# Output the endpoint
output "rds_endpoint" {
    value = aws_db_instance.postgres.endpoint
}

# Get latest Ubuntu AMI id
data "aws_ami" "ubuntu" {
    most_recent = true
    owners      = ["099720109477"]

    filter {
        name    = "name"
        values  = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
    }
}

# Upload the public key to AWS
resource "aws_key_pair" "deployer" {
  key_name   = "budget-deploy-key"
  public_key = file("${path.module}/budget-deploy-key.pub")
}

# EC2 Instance
resource "aws_instance" "app_server" {
    ami             = data.aws_ami.ubuntu.id
    instance_type   = "t2.micro"

    key_name      = aws_key_pair.deployer.key_name

    subnet_id              = aws_subnet.public_1.id
    vpc_security_group_ids = [aws_security_group.app_sg.id]

    user_data = <<-EOF
                #!/bin/bash
                apt-get update -y
                apt-get install -y docker.io docker-compose
                systemctl start docker
                systemctl enable docker

                usermod -aG docker ubuntu

                mkdir -p /home/ubuntu/app
                chown ubuntu:ubuntu /home/ubuntu/app
                EOF
    
    tags = {
        Name = "budget-tracker-app-server"
    }
}

# Output the Public IP so you can access your app
output "ec2_public_ip" {
    value = aws_instance.app_server.public_ip
}