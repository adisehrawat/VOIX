/**
 * Quick test script to verify backend connection
 * Run with: node test-connection.js
 */

const http = require('http');

const testUrls = [
  'http://localhost:3000/health',
  'http://127.0.0.1:3000/health',
];

console.log('🧪 Testing backend connectivity...\n');

testUrls.forEach((url) => {
  const urlObj = new URL(url);
  
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname,
    method: 'GET',
    timeout: 5000,
  };

  console.log(`Testing: ${url}`);

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`✅ SUCCESS! Status: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);
      } else {
        console.log(`⚠️  Got status: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);
      }
    });
  });

  req.on('timeout', () => {
    console.log(`❌ TIMEOUT - Backend not responding at ${url}\n`);
    req.destroy();
  });

  req.on('error', (err) => {
    console.log(`❌ ERROR - Cannot connect to ${url}`);
    console.log(`   ${err.message}\n`);
  });

  req.end();
});

setTimeout(() => {
  console.log('\n📝 Summary:');
  console.log('If you see ✅ SUCCESS above, your backend is working!');
  console.log('If you see ❌ errors, make sure backend is running with: cd Backend && pnpm dev');
}, 1000);

