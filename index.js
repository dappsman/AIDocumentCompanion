#!/usr/bin/env node

// Simple deployment entry point
const { execSync } = require('child_process');

console.log('Starting Prompt Roast...');

// Set environment
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || 80;

// Run the server
try {
  execSync(`npx tsx server/index.ts`, { 
    stdio: 'inherit',
    env: { ...process.env, PORT: PORT }
  });
} catch (error) {
  console.error('Server error:', error);
  process.exit(1);
}