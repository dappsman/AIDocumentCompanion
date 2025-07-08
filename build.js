#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Building Prompt Roast for deployment...\n');

try {
  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  // Build the frontend
  console.log('🏗️ Building frontend...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  // Check if build was successful
  const buildDir = path.join(__dirname, 'client', 'dist');
  if (fs.existsSync(buildDir)) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: client/dist');
  } else {
    throw new Error('Build failed - dist directory not found');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}