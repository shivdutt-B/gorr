# GORR - Microservices-based Deployment Platform

GORR is a sophisticated deployment platform built using a microservices architecture, designed to handle project deployments with real-time monitoring and efficient resource management.

## System Architecture

The platform consists of six interconnected servers, each handling specific responsibilities:

### 1. Main Server (`main-server/`)

- Primary API server handling authentication, project management, and build requests
- Built with Express.js and Prisma ORM
- Manages user authentication and project metadata
- Handles build requests and project management operations

### 2. Build Server (`build-server/`)

- Responsible for building and deploying projects
- Integrates with AWS S3 for artifact storage
- Features real-time build logging through Redis
- Handles dependency installation and build processes
- Supports multiple project types and build configurations

### 3. Socket Server (`socket-server/`)

- Manages real-time communication using Socket.IO
- Integrates with Redis for pub/sub messaging
- Provides real-time build logs and deployment status updates
- Handles WebSocket connections for live updates

### 4. Proxy Server (`proxy-server/`)

- Reverse proxy server for handling project deployments
- Routes requests to appropriate S3 buckets
- Supports custom domain and subdomain routing
- Handles both regular and Angular-specific routing patterns

### 5. Ping-Pong Server (`ping-pong-server/`)

- Health monitoring system for all services
- Tracks uptime and performance metrics
- Provides detailed status information for each service
- Maintains service reliability through regular health checks

### 6. Client Application (`client/`)

- Frontend interface built with modern web technologies
- Uses Vite as the build tool
- Implements Tailwind CSS for styling
- Features real-time deployment monitoring

## Key Features

- Real-time build and deployment monitoring
- Distributed microservices architecture
- Health monitoring and automatic recovery
- AWS S3 integration for artifact storage
- Redis-based real-time logging
- Custom domain and subdomain support
- Comprehensive error handling and logging

## Technical Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React/Vite
- **Database**: Prisma ORM
- **Real-time**: Socket.IO, Redis
- **Cloud Storage**: AWS S3
- **Styling**: Tailwind CSS
- **Build Tools**: Vite
- **Containerization**: Docker

## Environment Setup

Each service requires specific environment variables. Key variables include:

- `REDIS_URL`: Redis connection string
- `S3_ACCESS_KEY`: AWS S3 access key
- `S3_SECRET_ACCESS_KEY`: AWS S3 secret key
- `S3_REGION`: AWS S3 region
- `FRONTEND_URL`: Client application URL
- Various port configurations for different services

## Getting Started

1. Clone the repository
2. Set up environment variables for each service
3. Install dependencies in each service directory:
   ```bash
   cd [service-directory]
   npm install
   ```
4. Start each service in development mode:
   ```bash
   npm run dev
   ```

## Service Ports

- Main Server: 5000
- Build Server: Configured via env
- Socket Server: 7000
- Proxy Server: 8000
- Ping-Pong Server: 3001
- Client: 5173 (development)

## Monitoring and Health Checks

The platform includes comprehensive health monitoring through the Ping-Pong server, which provides:

- Service uptime tracking
- Response time monitoring
- Resource usage statistics
- Real-time service status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential. All rights reserved.
