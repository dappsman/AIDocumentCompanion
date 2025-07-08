#!/usr/bin/env node

// Deployment entry point for Replit
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Prompt Roast deployment...');

// Set environment
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 80;

// Check if client build exists, if not build it
const clientDistPath = path.join(__dirname, 'client', 'dist');
if (!fs.existsSync(clientDistPath)) {
  console.log('Client build not found, building...');
  try {
    execSync('cd client && npm install && npm run build', { 
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('Client build completed');
  } catch (error) {
    console.error('Client build failed:', error);
    process.exit(1);
  }
}

// Start the server
console.log(`Starting server on port ${PORT}...`);
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT },
  cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

serverProcess.on('error', (error) => {
  console.error('Server process error:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});