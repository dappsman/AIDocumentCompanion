#!/usr/bin/env node

// Production deployment script for Replit
console.log('🚀 Starting Prompt Roast production deployment...');

// Set production environment
process.env.NODE_ENV = 'production';

// Import required modules
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

// Check if client build exists, if not build it
const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (!fs.existsSync(clientBuildPath)) {
  console.log('📦 Building client for production...');
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
    console.log('✅ Client build completed');
  } catch (error) {
    console.error('❌ Client build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Client build found');
}

// Start the server
console.log(`🚀 Starting server on ${HOST}:${PORT}...`);

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
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  server.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('⏰ Force killing server...');
    server.kill('SIGKILL');
    process.exit(0);
  }, 10000);
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

console.log('🔥 Prompt Roast production server starting...');
console.log(`📱 Application will be available at: http://${HOST}:${PORT}`);
console.log(`🩺 Health check: http://${HOST}:${PORT}/health`);