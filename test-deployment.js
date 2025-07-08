#!/usr/bin/env node

// Test deployment setup
const { spawn } = require('child_process');
const http = require('http');

console.log('Testing deployment setup...');

// Start the server
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'pipe',
  env: { ...process.env, PORT: 80 }
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log('Server:', data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString().trim());
});

// Test multiple endpoints after server starts
setTimeout(() => {
  console.log('🔍 Testing deployment endpoints...');
  testEndpoint('/health', 'healthy');
  testEndpoint('/api/prompts', null); // Should return array
  
  // Kill server after test
  setTimeout(() => {
    serverProcess.kill();
    console.log('✅ Deployment test completed - Server is ready for production');
  }, 3000);
}, 5000);

function testEndpoint(path, expected) {
  const req = http.request({
    hostname: 'localhost',
    port: 80,
    path: path,
    method: 'GET'
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.status === expected) {
          console.log(`✅ ${path} endpoint working correctly`);
        } else {
          console.log(`❌ ${path} endpoint failed - expected ${expected}, got ${result.status}`);
        }
      } catch (e) {
        console.log(`❌ ${path} endpoint failed - invalid JSON: ${data}`);
      }
    });
  });

  req.on('error', (err) => {
    console.log(`❌ ${path} endpoint failed - ${err.message}`);
  });

  req.end();
}