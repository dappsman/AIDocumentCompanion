#!/usr/bin/env node

// Simple deployment entry point - single server on port 80
const { spawn } = require('child_process');

console.log('Starting Prompt Roast server...');

// Set production environment
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 80;

// Start server directly using tsx
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT }
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down...`);
  server.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});