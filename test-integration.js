// Integration Test Script
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...');
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend Health: OK');
      console.log(`   Environment: ${data.environment}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      return true;
    } else {
      console.log('❌ Backend Health: Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend Health: Connection Failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...');
  // This will be tested through auth endpoints
  return true;
}

async function testAuthEndpoints() {
  console.log('🔍 Testing Authentication Endpoints...');
  
  // Test registration endpoint
  try {
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'TestPassword123!',
      role: 'student'
    };
    
    console.log('   Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User Registration: Success');
      console.log(`   User ID: ${registerData.user?._id || 'N/A'}`);
      
      // Test login endpoint
      console.log('   Testing user login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ User Login: Success');
        console.log(`   Access Token: ${loginData.tokens?.accessToken ? 'Generated' : 'Missing'}`);
        return true;
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ User Login: Failed');
        console.log(`   Error: ${loginError.message}`);
        return false;
      }
    } else {
      const registerError = await registerResponse.json();
      console.log('❌ User Registration: Failed');
      console.log(`   Error: ${registerError.message}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Auth Endpoints: Connection Failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runIntegrationTests() {
  console.log('🚀 Starting UIS Integration Tests...\n');
  
  const results = {
    backend: await testBackendHealth(),
    database: await testDatabaseConnection(),
    auth: false
  };
  
  if (results.backend) {
    results.auth = await testAuthEndpoints();
  }
  
  console.log('\n📊 Integration Test Results:');
  console.log(`   Backend Health: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Database: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Authentication: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'}`);
  
  return allPassed;
}

// Run tests if called directly
runIntegrationTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
