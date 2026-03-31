// Test script to verify role-based API access
// Run this with: node test-roles.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials - create these users via registration page
const users = {
  admin: { email: 'admin@test.com', password: 'password123' }, // Created via create-admin.js
  organizer: { email: 'organizer@test.com', password: 'password123' }, // Register as Tournament Organizer
  player: { email: 'player@test.com', password: 'password123' } // Register as Player
};

async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data.data.token;
  } catch (error) {
    console.error(`Login failed for ${email}:`, error.response?.data?.message);
    return null;
  }
}

async function testEndpoint(token, method, endpoint, description) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    let response;
    
    switch (method) {
      case 'GET':
        response = await axios.get(`${API_BASE}${endpoint}`, config);
        break;
      case 'POST':
        response = await axios.post(`${API_BASE}${endpoint}`, {}, config);
        break;
      case 'PUT':
        response = await axios.put(`${API_BASE}${endpoint}`, {}, config);
        break;
      case 'DELETE':
        response = await axios.delete(`${API_BASE}${endpoint}`, config);
        break;
    }
    
    console.log(`✅ ${description} - SUCCESS`);
    return true;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    if (status === 401) {
      console.log(`🔒 ${description} - UNAUTHORIZED (expected)`);
    } else if (status === 403) {
      console.log(`🚫 ${description} - FORBIDDEN (expected)`);
    } else {
      console.log(`❌ ${description} - ERROR: ${message}`);
    }
    return false;
  }
}

async function testUserRole(role, userData) {
  console.log(`\n🧪 Testing ${role.toUpperCase()} Role Access:`);
  console.log('='.repeat(50));
  
  const token = await login(userData.email, userData.password);
  if (!token) {
    console.log(`❌ Could not login as ${role}`);
    return;
  }
  
  console.log(`✅ Logged in as ${role}`);
  
  // Test read endpoints (should work for all authenticated users)
  await testEndpoint(token, 'GET', '/tournaments', 'GET /tournaments');
  await testEndpoint(token, 'GET', '/matches', 'GET /matches');
  await testEndpoint(token, 'GET', '/games', 'GET /games');
  await testEndpoint(token, 'GET', '/players', 'GET /players');
  
  // Test write endpoints (should work for admin/organizer only)
  await testEndpoint(token, 'POST', '/tournaments', 'POST /tournaments');
  await testEndpoint(token, 'POST', '/games', 'POST /games');
  await testEndpoint(token, 'POST', '/matches', 'POST /matches');
  await testEndpoint(token, 'POST', '/players', 'POST /players');
}

async function runTests() {
  console.log('🔐 Testing Role-Based API Access Control');
  console.log('==========================================');
  console.log('\nAvailable Roles:');
  console.log('- Admin: Full system access');
  console.log('- Tournament Organizer: Can manage tournaments, games, matches, players');
  console.log('- Player: Can view public data and own profile');
  
  // Test each role
  for (const [role, userData] of Object.entries(users)) {
    await testUserRole(role, userData);
  }
  
  console.log('\n✨ Testing Complete!');
  console.log('\nExpected Results:');
  console.log('- Admin: All endpoints should work');
  console.log('- Tournament Organizer: All endpoints should work except admin-only ones');
  console.log('- Player: Only GET endpoints should work, POST/PUT/DELETE should be forbidden');
}

runTests().catch(console.error);
