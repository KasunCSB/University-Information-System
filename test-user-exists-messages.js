#!/usr/bin/env node

// Test script to verify improved error messages for user registration
const API_URL = 'http://localhost:3001/api';

async function testUserExistsMessages() {
  console.log('🧪 Testing Improved User Registration Error Messages...\n');

  // Test data
  const testEmail = 'existing@example.com';
  const testUsername = 'existinguser';
  const testPassword = 'TestPass123!';

  console.log('1. First, let\'s register a test user...');
  
  try {
    // Register a test user first
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: testPassword,
        role: 'student'
      })
    });

    const registerData = await registerResponse.json();
    console.log(`   Status: ${registerResponse.status}`);
    console.log(`   Message: ${registerData.message}\n`);

    // Now test various scenarios
    const testCases = [
      {
        name: 'Same email, different username',
        data: {
          username: 'differentuser',
          email: testEmail,
          password: testPassword
        },
        expectedMessage: 'email address already exists'
      },
      {
        name: 'Same username, different email',
        data: {
          username: testUsername,
          email: 'different@example.com',
          password: testPassword
        },
        expectedMessage: 'username is already taken'
      },
      {
        name: 'Same email and username',
        data: {
          username: testUsername,
          email: testEmail,
          password: testPassword
        },
        expectedMessage: 'Both email and username are already registered'
      }
    ];

    console.log('2. Testing specific error messages...\n');

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);
      
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testCase.data)
        });

        const data = await response.json();
        
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${data.message}`);
        
        if (data.message.toLowerCase().includes(testCase.expectedMessage.toLowerCase())) {
          console.log(`   ✅ Correct specific error message displayed\n`);
        } else {
          console.log(`   ❌ Expected message containing "${testCase.expectedMessage}" but got "${data.message}"\n`);
        }
      } catch (error) {
        console.log(`   ❌ Network error: ${error.message}\n`);
      }
    }

    console.log('3. Testing pre-registration verification error messages...\n');
    
    // Test pre-registration verification with existing email
    console.log('Testing send-verification with existing email...');
    const preRegResponse = await fetch(`${API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    });

    const preRegData = await preRegResponse.json();
    console.log(`   Status: ${preRegResponse.status}`);
    console.log(`   Message: ${preRegData.message}`);
    
    if (preRegData.message.toLowerCase().includes('already exists')) {
      console.log(`   ✅ Pre-registration correctly identifies existing email\n`);
    } else {
      console.log(`   ❌ Pre-registration error message not specific enough\n`);
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }

  console.log('🏁 User registration error message test completed!');
}

// Run the test
testUserExistsMessages().catch(console.error);
