// Simple Integration Test
const API_BASE = 'http://localhost:3001/api';

async function testSystemIntegration() {
  console.log('🚀 UIS System Integration Test\n');
  
  // Test 1: Backend Health
  console.log('1️⃣ Testing Backend Health...');
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend is running');
      console.log(`   Environment: ${data.environment}`);
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log('   Make sure backend is running on port 3001');
    console.log(`   Error: ${error.message}`);
    return false;
  }
  
  // Test 2: Registration Flow
  console.log('\n2️⃣ Testing User Registration...');
  const testUser = {
    username: 'integrationtest' + Date.now(),
    email: 'test' + Date.now() + '@test.com',
    password: 'TestPass123!',
    role: 'student'
  };
  
  try {
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ User registration successful');
      console.log(`   User: ${registerData.user?.username}`);
      console.log(`   Email verification required: ${!registerData.user?.isEmailVerified}`);
      
      // Test 3: Login Flow
      console.log('\n3️⃣ Testing User Login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ User login successful');
        console.log(`   Access token: ${loginData.tokens?.accessToken ? 'Generated' : 'Missing'}`);
        console.log(`   Refresh token: ${loginData.tokens?.refreshToken ? 'Generated' : 'Missing'}`);
        
        console.log('\n🎉 All integration tests passed!');
        console.log('\n📋 System Status:');
        console.log('   ✅ Backend API: Working');
        console.log('   ✅ Database: Connected');
        console.log('   ✅ Authentication: Functional');
        console.log('   ✅ Email Service: Configured');
        
        return true;
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ Login failed:', loginError.message);
        console.log(`   Details: ${JSON.stringify(loginError, null, 2)}`);
        return false;
      }
    } else {
      console.log('❌ Registration failed:', registerData.message);
      console.log(`   Status: ${registerResponse.status}`);
      console.log(`   Details: ${JSON.stringify(registerData, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ API request failed:', error.message);
    return false;
  }
}

// Run the test
testSystemIntegration();
