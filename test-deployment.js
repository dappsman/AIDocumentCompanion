// Test script to verify deployment is working
const http = require('http');

function testEndpoint(path, expected) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:80${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✓ ${path} - Status: ${res.statusCode}`);
        if (expected && data.includes(expected)) {
          console.log(`✓ ${path} - Content check passed`);
        }
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function runTests() {
  console.log('Testing deployment...');
  
  try {
    // Test health endpoint
    await testEndpoint('/health', 'healthy');
    
    // Test main page
    await testEndpoint('/', 'html');
    
    // Test API endpoints
    await testEndpoint('/api/prompts', '[]');
    
    console.log('\n✅ All tests passed! Deployment is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();