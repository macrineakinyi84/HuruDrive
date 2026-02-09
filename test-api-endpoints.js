/**
 * API Endpoint Testing Script
 * Tests all critical endpoints to verify system stability
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n1. Testing Health Check...');
  try {
    const result = await makeRequest('GET', '/api/health');
    if (result.status === 200) {
      console.log('   ✅ Health check passed');
      return true;
    } else {
      console.log('   ❌ Health check failed:', result.status);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Health check error:', err.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n2. Testing User Registration...');
  try {
    const email = `test${Date.now()}@example.com`;
    const result = await makeRequest('POST', '/api/auth/register', {
      name: 'Test User',
      email,
      phone: '0712345678',
      password: 'test123456',
    });

    if (result.status === 201 && result.data.token) {
      authToken = result.data.token;
      console.log('   ✅ Registration successful');
      return true;
    } else {
      console.log('   ❌ Registration failed:', result.status, result.data);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Registration error:', err.message);
    return false;
  }
}

async function testGetVehicles() {
  console.log('\n3. Testing Get Vehicles...');
  try {
    const result = await makeRequest('GET', '/api/vehicles');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`   ✅ Retrieved ${result.data.length} vehicles`);
      return true;
    } else {
      console.log('   ❌ Get vehicles failed:', result.status);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Get vehicles error:', err.message);
    return false;
  }
}

async function testGetUserBookings() {
  console.log('\n4. Testing Get User Bookings...');
  try {
    const result = await makeRequest('GET', '/api/user/bookings', null, authToken);
    if (result.status === 200) {
      console.log('   ✅ Get user bookings successful');
      return true;
    } else {
      console.log('   ❌ Get user bookings failed:', result.status, result.data);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Get user bookings error:', err.message);
    return false;
  }
}

async function testGetUserStats() {
  console.log('\n5. Testing Get User Stats...');
  try {
    const result = await makeRequest('GET', '/api/user/stats', null, authToken);
    if (result.status === 200) {
      console.log('   ✅ Get user stats successful');
      return true;
    } else {
      console.log('   ❌ Get user stats failed:', result.status);
      return false;
    }
  } catch (err) {
    console.log('   ❌ Get user stats error:', err.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('='.repeat(50));
  console.log('HuruDrive API Endpoint Testing');
  console.log('='.repeat(50));

  const results = [];

  results.push(await testHealthCheck());
  
  if (!results[0]) {
    console.log('\n❌ Server is not running or health check failed!');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }

  results.push(await testRegister());
  results.push(await testGetVehicles());
  
  if (authToken) {
    results.push(await testGetUserBookings());
    results.push(await testGetUserStats());
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`Passed: ${passed}/${total}`);

  if (passed === total) {
    console.log('\n✅ All tests passed! System is stable.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
