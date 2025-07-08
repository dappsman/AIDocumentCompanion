#!/bin/bash

# Deployment script for Replit
echo "Building client..."
cd client
npm install
npm run build
cd ..

echo "Starting server on port ${PORT:-80}..."
npx tsx server/index.ts