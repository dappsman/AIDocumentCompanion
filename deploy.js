#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Prompt Roast for deployment...\n');

// Start the backend server on port 80 for deployment
const PORT = process.env.PORT || 80;
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, PORT: PORT }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err);
});

console.log(`Server starting on port ${PORT}...`);