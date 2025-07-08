#!/usr/bin/env node

// Main deployment entry point for Replit
console.log('🚀 Starting Prompt Roast for deployment...');

// Set production environment
process.env.NODE_ENV = 'production';

// Use the working deployment approach
const { spawn } = require('child_process');

const PORT = process.env.PORT || 80;
console.log(`📦 Starting server on port ${PORT}`);

// Start the server using tsx (which we know works)
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT }
});

// Handle process cleanup
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  server.kill('SIGTERM');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

console.log('🔥 Prompt Roast server started!');