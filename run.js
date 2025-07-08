const { spawn } = require('child_process');

// Start the backend server
const backend = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Start the frontend development server
const frontend = spawn('vite', ['--host', '0.0.0.0', '--port', '5173'], {
  stdio: 'inherit',
  cwd: './client'
});

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

console.log('Starting Prompt Roast application...');
console.log('Backend running on: http://localhost:3000');
console.log('Frontend running on: http://localhost:5173');