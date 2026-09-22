#!/bin/bash

set -e

echo "Starting deployment..."

git pull origin main

docker compose up -d --build

echo "Deployment completed successfully."
