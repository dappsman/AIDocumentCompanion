#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Prompt Roast Application...\n');

// Start backend server
console.log('🔧 Starting backend server...');
const backend = spawn('node_modules/.bin/tsx', ['server/index.ts'], {
  cwd: process.cwd(),
  stdio: ['inherit', 'inherit', 'inherit'],
  env: { ...process.env, PORT: '3000' }
});

// Give backend time to start
setTimeout(() => {
  console.log('🎨 Starting frontend server...');
  const frontend = spawn('node_modules/.bin/vite', [
    '--host', '0.0.0.0', 
    '--port', '5173'
  ], {
    cwd: path.join(process.cwd(), 'client'),
    stdio: ['inherit', 'inherit', 'inherit']
  });

  // Handle process cleanup
  const cleanup = () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    setTimeout(() => {
      backend.kill('SIGKILL');
      frontend.kill('SIGKILL');
      process.exit(0);
    }, 2000);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  backend.on('close', (code) => {
    if (code !== 0) {
      console.log(`❌ Backend exited with code ${code}`);
    }
  });

  frontend.on('close', (code) => {
    if (code !== 0) {
      console.log(`❌ Frontend exited with code ${code}`);
    }
  });

  setTimeout(() => {
    console.log('\n🔥 Prompt Roast is ready!');
    console.log('📱 Frontend: http://localhost:5173');
    console.log('🔧 Backend API: http://localhost:3000');
    console.log('\nPress Ctrl+C to stop the servers.\n');
  }, 3000);

}, 2000);

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err);
});