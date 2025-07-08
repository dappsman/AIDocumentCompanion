#!/usr/bin/env node

// Main entry point for Replit deployment
console.log('🚀 Starting Prompt Roast deployment...');

// Set environment variables
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 80;

// Check if client build exists
const fs = require('fs');
const path = require('path');

const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (!fs.existsSync(clientBuildPath)) {
  console.log('📦 Client build not found, building...');
  const { execSync } = require('child_process');
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
    console.log('✅ Client build completed');
  } catch (error) {
    console.error('❌ Client build failed:', error.message);
    process.exit(1);
  }
}

// Start the server
const { spawn } = require('child_process');

console.log(`📦 Starting server on port ${PORT}...`);

const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down...');
  server.kill('SIGTERM');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Server exited with code ${code}`);
  process.exit(code);
});

console.log('🔥 Prompt Roast server starting...');