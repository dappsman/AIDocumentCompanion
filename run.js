// Simple run script for deployment
require('child_process').spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || 80 }
});