// Direct server entry point for deployment
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start the actual TypeScript server as a child process
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT }
});

// Handle cleanup
process.on('SIGTERM', () => server.kill('SIGTERM'));
process.on('SIGINT', () => server.kill('SIGTERM'));

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

console.log(`Server starting on port ${PORT}`);