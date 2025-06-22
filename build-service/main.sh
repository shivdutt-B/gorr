#!/bin/bash

# Export repo URL
export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

# Clone the repo
git clone "$GIT_REPOSITORY_URL" /home/app/site

# Run main.js with a 5-minute timeout
echo "⏱️ Starting build with a max timeout of 5 minutes..."
timeout 300 node main.js

# Capture exit code
EXIT_CODE=$?

# Check why it exited
if [ $EXIT_CODE -eq 124 ]; then
  echo "⏰ Timeout reached. Container exiting after 5 minutes."
elif [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Build failed with exit code $EXIT_CODE"
else
  echo "✅ Build and upload completed successfully"
fi

exit $EXIT_CODE
