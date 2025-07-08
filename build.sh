#!/bin/bash

echo "🔧 Building Prompt Roast for deployment..."

# Build the client
echo "📦 Building client..."
cd client
npm run build
cd ..

echo "✅ Build completed successfully!"