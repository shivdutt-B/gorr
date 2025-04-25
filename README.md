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
- [License](#-license)

## 🏗 System Architecture

<div align="center">
  <img src="README.ASSETS/arch.png" alt="GORR Architecture" width="100%">
</div>

The platform consists of six interconnected servers, each handling specific responsibilities:

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

### 5. 🏓 Ping-Pong Server (`ping-pong-server/`)

- Health monitoring system for all services
- Tracks uptime and performance metrics
- Provides detailed status information for each service
- Maintains service reliability through regular health checks

### 6. 💻 Client Application (`client/`)

- Frontend interface built with modern web technologies
- Uses Vite as the build tool
- Implements Tailwind CSS for styling
- Features real-time deployment monitoring

## ✨ Key Features

| Feature                 | Description                               |
| ----------------------- | ----------------------------------------- |
| 📊 Real-time Monitoring | Live build and deployment status updates  |
| 🔄 Microservices        | Distributed architecture for scalability  |
| 🔍 Health Checks        | Automated service monitoring and recovery |
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
| **Database**  | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)                                                                                                            |
| **Real-time** | ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)       |
| **Cloud**     | ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white)                                                                                                          |
| **Styling**   | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)                                                                                           |
| **DevOps**    | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)                                                                                                            |

</div>

## ⚙️ Environment Setup

Each service requires specific environment variables. Create a `.env` file in each service directory:

```env
# Required Environment Variables
REDIS_URL=your_redis_url
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_REGION=your_s3_region
FRONTEND_URL=your_frontend_url

# Optional Environment Variables
LOG_LEVEL=debug
NODE_ENV=development
```

## 🚀 Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/gorr.git
   cd gorr
   ```

2. **Set Up Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Install Dependencies**

   ```bash
   # Install dependencies for all services
   npm run install-all

   # Or install individually
   cd [service-directory]
   npm install
   ```

4. **Start Development Servers**

   ```bash
   # Start all services
   npm run dev

   # Or start individual services
   cd [service-directory]
   npm run dev
   ```

## 🔌 Service Ports

| Service          | Port | Description             |
| ---------------- | ---- | ----------------------- |
| Main Server      | 5000 | API and authentication  |
| Build Server     | ENV  | Build and deployment    |
| Socket Server    | 7000 | Real-time communication |
| Proxy Server     | 8000 | Reverse proxy           |
| Ping-Pong Server | 3001 | Health monitoring       |
| Client           | 5173 | Development server      |

## 📊 Monitoring and Health Checks

The Ping-Pong server provides comprehensive monitoring:

- 📈 Real-time service uptime tracking
- ⏱️ Response time monitoring
- 📊 Resource usage statistics
- 🔍 Service health status

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

<div align="center">

Made with ❤️ by the GORR Team

</div>
