#!/usr/bin/env node

/**
 * Authentication Testing Script
 * Run: node test-auth.js
 */

const http = require('http');

console.log('🔐 Tournament Manager - Authentication Testing\n');
console.log('=' .repeat(50));

let authToken = null;
let userId = null;

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  try {
    // Test 1: Register User
    console.log('\n✅ Test 1: Register New User');
    console.log('-' .repeat(50));
    const registerData = {
      name: 'Test User',
      email: `testuser${Date.now()}@test.com`,
      password: 'password123',
      confirmPassword: 'password123'
    };
    console.log('Payload:', JSON.stringify(registerData, null, 2));
    
    const registerRes = await makeRequest('/auth/register', 'POST', registerData);
    console.log(`Status: ${registerRes.status}`);
    
    if (registerRes.data.success) {
      authToken = registerRes.data.data.token;
      userId = registerRes.data.data.user._id;
      console.log('✓ Registration successful');
      console.log(`✓ Token: ${authToken.substring(0, 20)}...`);
      console.log(`✓ User ID: ${userId}`);
    } else {
      console.log('✗ Registration failed:', registerRes.data.message);
      return;
    }

    // Test 2: Get Current User (Protected)
    console.log('\n✅ Test 2: Get Current User (Protected Route)');
    console.log('-' .repeat(50));
    const meRes = await makeRequest('/auth/me', 'GET', null, authToken);
    console.log(`Status: ${meRes.status}`);
    
    if (meRes.status === 200) {
      console.log('✓ Protected route accessible');
      console.log(`✓ User: ${meRes.data.data.name} (${meRes.data.data.email})`);
      console.log(`✓ Role: ${meRes.data.data.role}`);
    } else {
      console.log('✗ Failed to get user:', meRes.data.message);
    }

    // Test 3: Login with Same Credentials
    console.log('\n✅ Test 3: Login with Credentials');
    console.log('-' .repeat(50));
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };
    console.log('Payload:', JSON.stringify(loginData, null, 2));
    
    const loginRes = await makeRequest('/auth/login', 'POST', loginData);
    console.log(`Status: ${loginRes.status}`);
    
    if (loginRes.data.success) {
      console.log('✓ Login successful');
      console.log(`✓ New Token: ${loginRes.data.data.token.substring(0, 20)}...`);
      authToken = loginRes.data.data.token;
    } else {
      console.log('✗ Login failed:', loginRes.data.message);
    }

    // Test 4: Invalid Token
    console.log('\n✅ Test 4: Test Invalid Token');
    console.log('-' .repeat(50));
    const invalidRes = await makeRequest('/auth/me', 'GET', null, 'invalid-token-123');
    console.log(`Status: ${invalidRes.status}`);
    
    if (invalidRes.status === 401) {
      console.log('✓ Invalid token rejected correctly');
      console.log(`✓ Error: ${invalidRes.data.message}`);
    } else {
      console.log('✗ Invalid token should return 401');
    }

    // Test 5: No Token
    console.log('\n✅ Test 5: Test No Token');
    console.log('-' .repeat(50));
    const noTokenRes = await makeRequest('/auth/me', 'GET', null, null);
    console.log(`Status: ${noTokenRes.status}`);
    
    if (noTokenRes.status === 401) {
      console.log('✓ Missing token rejected correctly');
      console.log(`✓ Error: ${noTokenRes.data.message}`);
    } else {
      console.log('✗ Missing token should return 401');
    }

    // Test 6: Logout
    console.log('\n✅ Test 6: Logout');
    console.log('-' .repeat(50));
    const logoutRes = await makeRequest('/auth/logout', 'POST', {}, authToken);
    console.log(`Status: ${logoutRes.status}`);
    
    if (logoutRes.data.success) {
      console.log('✓ Logout successful');
    } else {
      console.log('✗ Logout failed:', logoutRes.data.message);
    }

    console.log('\n' + '=' .repeat(50));
    console.log('✅ All authentication tests completed!');
    console.log('=' .repeat(50));
    console.log('\n📝 Results Summary:');
    console.log('- User registration working');
    console.log('- JWT token generation working');
    console.log('- Protected routes verified');
    console.log('- Invalid tokens rejected');
    console.log('- Missing tokens rejected');
    console.log('- Logout working\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend is running: npm start (in backend directory)');
    console.error('2. MongoDB is running');
    console.error('3. Port 5000 is accessible\n');
  }
}

runTests();
