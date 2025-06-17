#!/bin/bash

# Function to handle cleanup on script exit
cleanup() {
    echo "Stopping containers..."
    docker-compose -f docker-compose.yml down
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start the development environment
echo "Starting development environment..."
docker-compose -f docker-compose.yml up --build

# Keep the script running until interrupted
wait 