#!/bin/bash

# Clone the repo
git clone "$GIT_REPOSITORY_URL" /home/app/site

# Run main.js with a 5-minute timeout
echo "[build-service] Starting build execution (timeout: 5m)..."
timeout 300 node main.js

# Capture exit code
EXIT_CODE=$?

# Check why it exited
if [ $EXIT_CODE -eq 124 ]; then
  echo "[build-service] Timeout reached. Process terminated after 5 minutes."
elif [ $EXIT_CODE -ne 0 ]; then
  echo "[build-service] Build process failed with exit code $EXIT_CODE"
else
  echo "[build-service] Build and deployment completed successfully"
fi

exit $EXIT_CODE
