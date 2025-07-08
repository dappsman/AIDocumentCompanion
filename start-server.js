#!/usr/bin/env node

// Simple server start for deployment
const { spawn } = require('child_process');

const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);

// Start the TypeScript server
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT }
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  server.kill('SIGTERM');
});