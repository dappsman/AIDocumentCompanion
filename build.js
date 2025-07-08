#!/usr/bin/env node

// Build script for Prompt Roast
console.log('📦 Building Prompt Roast for production...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Check if client directory exists
  const clientPath = path.join(__dirname, 'client');
  if (!fs.existsSync(clientPath)) {
    console.error('❌ Client directory not found');
    process.exit(1);
  }

  // Build the client
  console.log('🔧 Building client...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  // Verify build output
  const buildPath = path.join(clientPath, 'dist');
  if (fs.existsSync(buildPath)) {
    console.log('✅ Client build completed successfully');
    console.log(`📁 Build output: ${buildPath}`);
  } else {
    console.error('❌ Build failed - output directory not found');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}