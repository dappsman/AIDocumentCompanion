#!/usr/bin/env node

// Production startup script for Prompt Roast
console.log('🚀 Starting Prompt Roast in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';

const { spawn } = require('child_process');
const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

// Start the server using tsx
console.log(`🔥 Starting server on ${HOST}:${PORT}...`);

const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    PORT: PORT,
    HOST: HOST,
    NODE_ENV: 'production'
  }
});

// Handle graceful shutdown
const cleanup = (signal) => {
  console.log(`🛑 Received ${signal}, shutting down...`);
  server.kill('SIGTERM');
  
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGTERM', () => cleanup('SIGTERM'));
process.on('SIGINT', () => cleanup('SIGINT'));

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Server exited with code ${code}`);
  process.exit(code);
});

console.log(`📱 Application starting at: http://${HOST}:${PORT}`);
console.log(`🩺 Health check: http://${HOST}:${PORT}/health`);