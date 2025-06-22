# Use Ubuntu focal as base image
FROM ubuntu:focal

# Set environment variable to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install necessary packages in one step to reduce layers
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /home/app

# Copy required files
COPY main.sh main.sh
COPY main.js main.js
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy .env file if available (Optional)
COPY .env .env

# Make main.sh executable (chmod for main.js is not necessary)
RUN chmod +x main.sh

# Set the entry point to main.sh
ENTRYPOINT ["/home/app/main.sh"]
