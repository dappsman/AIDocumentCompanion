#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Prompt Roast for production deployment...\n');

// Set environment variables for production
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 80;

console.log('📦 Starting server on port', PORT);

// Start the backend server
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, PORT: PORT }
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Gracefully shutting down server...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

console.log('🔥 Prompt Roast production server started!');
console.log(`📍 Server running on port ${PORT}`);
console.log('🩺 Health check available at /health');