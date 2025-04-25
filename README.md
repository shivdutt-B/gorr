# 🚀 GORR - Microservices-based Deployment Platform

<div align="center">

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen.svg)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/express-%5E4.17.1-blue.svg)](https://expressjs.com)
[![Socket.IO](https://img.shields.io/badge/socket.io-%5E4.0.0-black.svg)](https://socket.io)
[![Redis](https://img.shields.io/badge/redis-%5E4.0.0-red.svg)](https://redis.io)
[![AWS S3](https://img.shields.io/badge/AWS%20S3-integrated-orange.svg)](https://aws.amazon.com/s3)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com)

GORR is a sophisticated deployment platform built using a microservices architecture, designed to handle project deployments with real-time monitoring and efficient resource management.

[Getting Started](#getting-started) •
[Documentation](#system-architecture) •
[Features](#key-features) •
[Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Technical Stack](#-technical-stack)
- [Environment Setup](#-environment-setup)
- [Getting Started](#-getting-started)
- [Service Ports](#-service-ports)
- [Monitoring](#-monitoring-and-health-checks)
- [Contributing](#-contributing)

## 🏗 System Architecture

<div align="center">
  <img src="README.ASSETS/arch.png" alt="GORR Architecture" width="100%">
</div>

The platform consists of five interconnected servers, each handling specific responsibilities:

### 1. 🎯 Main Server (`main-server/`)

- Primary API server handling authentication, project management, and build requests
- Built with Express.js and Prisma ORM
- Manages user authentication and project metadata
- Handles build requests and project management operations

### 2. 🏭 Build Server (`build-server/`)

- Responsible for building and deploying projects
- Integrates with AWS S3 for artifact storage
- Features real-time build logging through Redis
- Handles dependency installation and build processes
- Supports multiple project types and build configurations

### 3. 🔌 Socket Server (`socket-server/`)

- Manages real-time communication using Socket.IO
- Integrates with Redis for pub/sub messaging
- Provides real-time build logs and deployment status updates
- Handles WebSocket connections for live updates

### 4. 🔄 Proxy Server (`proxy-server/`)

- Reverse proxy server for handling project deployments
- Routes requests to appropriate S3 buckets
- Supports custom domain and subdomain routing
- Handles both regular and Angular-specific routing patterns

### 5. 💻 Client Application (`client/`)

- Frontend interface built with modern web technologies
- Uses Vite as the build tool
- Implements Tailwind CSS for styling
- Features real-time deployment monitoring

## ✨ Key Features

| Feature                 | Description                               |
| ----------------------- | ----------------------------------------- |
| 📊 Real-time Monitoring | Live build and deployment status updates  |
| 🔄 Microservices        | Distributed architecture for scalability  |
| ☁️ AWS Integration      | S3-based artifact storage and deployment  |
| 📡 Real-time Logging    | Redis-powered live log streaming          |
| 🌐 Custom Domains       | Support for custom domains and subdomains |
| 🛡️ Error Handling       | Comprehensive error tracking and logging  |

## 🛠 Technical Stack

<div align="left">

| Category      | Technologies                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**   | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) |
| **Frontend**  | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                        |
| **Database**  | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)   |
| **Real-time** | ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)       |
| **Cloud**     | ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white)                                                                                                          |
| **Styling**   | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)                                                                                           |
| **DevOps**    | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)                                                                                                            |

</div>

## ⚙️ Environment Setup

Create `.env.example` files in each service directory with the following configurations:

### 🎯 Main Server (`main-server/.env.example`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gorr"
REDIS_URL="redis://localhost:6379"

# AWS Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# AWS Region
AWS_ECS_REGION=your_aws_region

# AWS ECS Configuration
ECS_CLUSTER=your_ecs_cluster_arn
ECS_TASK=your_ecs_task_arn
ECS_LAUNCH_TYPE=FARGATE
ECS_COUNT=1
ECS_SUBNETS_1=your_subnet_1
ECS_SUBNETS_2=your_subnet_2
ECS_SUBNETS_3=your_subnet_3
ECS_SECURITY_GROUPS=your_security_group
ECS_IMAGE=your_ecs_image_name

# AWS S3 Configuration
AWS_S3_REGION=your_s3_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Redis Configuration
REDIS_URL=your_redis_connection_url
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

# PostgreSQL Database
DATABASE_URL=your_postgresql_database_url

# Frontend URL
FRONTEND_URL=your_frontend_url

# Proxy Domain
PROXY_DOMAIN=your_proxy_domain
```

### 🏭 Build Server (`build-server/.env.example`)

```env
# AWS S3 Configuration
S3_ACCESS_KEY=your_aws_s3_access_key
S3_SECRET_ACCESS_KEY=your_aws_s3_secret_access_key
S3_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name

# Redis Configuration
REDIS_URL=your_redis_connection_url

```

### 🔌 Socket Server (`socket-server/.env.example`)

```env
# Socket Server Port
SOCKET_PORT=7000

# Redis Configuration
REDIS_URL=your_redis_connection_url

```

### 🔄 Proxy Server (`proxy-server/.env.example`)

```env
# S3 Base Path (Public access URL for S3 bucket)
S3_BASE_PATH=http://your_s3_bucket_name.s3.your_region.amazonaws.com

# Server Port
PORT=8000

# AWS Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# AWS Region and Bucket
AWS_ECS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

### 💻 Client (`client/.env.example`)

```env
# GitHub OAuth Configuration
VITE_CLIENT_ID=your_github_client_id
VITE_CLIENT_SECRET=your_github_client_secret

# Socket Server URL
# Example: http://localhost:7000 (for development)
VITE_SOCKET_URL=your_socket_server_url

# GitHub OAuth Redirect URL
# Example: http://localhost:5000/auth/github/callback
VITE_GITHUB_REDIRECT_URL=your_github_redirect_url

# API Base URL
# Example: http://localhost:5000
VITE_API_BASE_URL=your_api_base_url
```

### Environment Setup Instructions

1. **Create Environment Files**

   ```bash
   # Create .env files from examples
   cd main-server && cp .env.example .env
   cd ../build-server && cp .env.example .env
   cd ../socket-server && cp .env.example .env
   cd ../proxy-server && cp .env.example .env
   cd ../client && cp .env.example .env
   ```

2. **Update Environment Variables**

   - Replace all placeholder values with your actual configuration
   - Ensure AWS credentials are properly set
   - Update database connection strings
   - Set appropriate URLs for your environment

3. **Development vs Production**

   - For development, local URLs and ports can be used
   - For production, update URLs to your deployed services
   - Ensure proper security measures for production credentials

4. **Security Notes**
   - Never commit `.env` files to version control
   - Keep production credentials secure
   - Rotate secrets periodically
   - Use strong JWT secrets

## 🚀 Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shivdutt-B/gorr.git
   cd gorr
   ```

2. **Set Up Environment Variables**

   ```bash
   # Copy example env files for each service
   cd main-server && cp .env.example .env
   cd ../build-server && cp .env.example .env
   cd ../socket-server && cp .env.example .env
   cd ../proxy-server && cp .env.example .env
   cd ../client && cp .env.example .env
   ```

3. **Install Dependencies**

   ```bash
   # Install dependencies for all services
   npm run install-all

   # Or install individually for each service
   cd main-server && npm install
   cd ../build-server && npm install
   cd ../socket-server && npm install
   cd ../proxy-server && npm install
   cd ../client && npm install
   ```

4. **Start Development Servers**

   ```bash
   # Start all services
   npm run dev

   # Or start individual services
   cd main-server && npm run dev
   cd ../build-server && npm run dev
   cd ../socket-server && npm run dev
   cd ../proxy-server && npm run dev
   cd ../client && npm run dev
   ```

## 🔌 Service Ports

| Service       | Port | Description             |
| ------------- | ---- | ----------------------- |
| Main Server   | 5000 | API and authentication  |
| Build Server  | ENV  | Build and deployment    |
| Socket Server | 7000 | Real-time communication |
| Proxy Server  | 8000 | Reverse proxy           |
| Client        | 5173 | Development server      |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Made by devs who CTRL+C dreams and CTRL+V life 🤓🚀

</div>
