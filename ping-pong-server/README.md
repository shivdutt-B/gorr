# Ping-Pong Server

A Node.js server that keeps multiple Render.com servers active by sending regular ping requests.

## Purpose

Free tier services on Render.com (and similar platforms) often "spin down" after periods of inactivity. This causes delays when new requests arrive as the server needs to "spin up" again.

This ping-pong server solves that problem by sending regular requests to keep your servers active.

## Servers Being Pinged

This service pings three different servers:

1. **Main Server** - The main application server
2. **Proxy Server** - The reverse proxy server that handles deployments
3. **Socket Server** - The WebSocket server that handles real-time communication

## Configuration

Set the following environment variables in the `.env` file:

```
PORT=3001
MAIN_SERVER_URL=https://gorr-main-server.onrender.com/ping
PROXY_SERVER_URL=https://gorr-proxy-server.onrender.com/ping
SOCKET_SERVER_URL=https://gorr-socket-server.onrender.com/ping
```

## How It Works

1. The ping-pong server runs a cron job every 5 minutes
2. The job sends HTTP GET requests to each of the configured server URLs
3. Each server has a `/ping` endpoint that responds with its current status
4. These regular pings keep the servers active on Render's free tier

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Configure the `.env` file with your server URLs

3. Start the server:
   ```
   npm start
   ```

## Deployment Recommendations

For best results, deploy this ping-pong server on a different platform than your main servers:

- Vercel
- Netlify
- Railway
- AWS EC2
- DigitalOcean
- A different Render.com instance (on a paid plan)

This ensures that even if one platform has issues, the ping-pong mechanism will still work.
