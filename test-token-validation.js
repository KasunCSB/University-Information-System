#!/usr/bin/env node

// Test script to verify email verification token validation
const API_URL = 'http://localhost:3001/api';

async function testTokenValidation() {
  console.log('🧪 Testing Email Verification Token Validation...\n');

  // Test cases
  const testCases = [
    {
      name: 'Valid token format (64 chars hex)',
      token: 'a'.repeat(64),
      shouldPass: true
    },
    {
      name: 'Valid token format (32 chars hex)',
      token: 'b'.repeat(32),
      shouldPass: true
    },
    {
      name: 'Empty token',
      token: '',
      shouldPass: false
    },
    {
      name: 'Too short token',
      token: 'abc123',
      shouldPass: false
    },
    {
      name: 'Too long token',
      token: 'a'.repeat(200),
      shouldPass: false
    },
    {
      name: 'Invalid characters (non-hex)',
      token: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
      shouldPass: false
    },
    {
      name: 'Mixed case hex (valid)',
      token: 'AbCdEf1234567890'.repeat(4),
      shouldPass: true
    }
  ];

  console.log('Testing validation rules...\n');

  for (const testCase of testCases) {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: testCase.token })
      });

      const data = await response.json();
      const passed = response.status === 400 && data.message?.includes('validation') ? false : true;
      
      if (testCase.shouldPass && !passed) {
        console.log(`❌ ${testCase.name}: Expected to pass validation but failed`);
        console.log(`   Token: "${testCase.token}"`);
        console.log(`   Response: ${response.status} - ${data.message}\n`);
      } else if (!testCase.shouldPass && passed) {
        console.log(`❌ ${testCase.name}: Expected to fail validation but passed`);
        console.log(`   Token: "${testCase.token}"`);
        console.log(`   Response: ${response.status} - ${data.message}\n`);
      } else {
        console.log(`✅ ${testCase.name}: ${testCase.shouldPass ? 'Passed' : 'Failed'} as expected`);
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: Network error - ${error.message}`);
    }
  }

  console.log('\n🔍 Testing actual verification flow...\n');
  
  // Test the actual verification flow
  try {
    // 1. Send verification email
    console.log('1. Testing send verification email...');
    const emailResponse = await fetch(`${API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com' })
    });

    const emailData = await emailResponse.json();
    console.log(`   Status: ${emailResponse.status}`);
    console.log(`   Message: ${emailData.message}`);

    if (emailResponse.ok) {
      console.log('✅ Send verification email endpoint working\n');
      
      // 2. Test with a fake token (should fail)
      console.log('2. Testing with fake token (should fail)...');
      const fakeToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const verifyResponse = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: fakeToken })
      });

      const verifyData = await verifyResponse.json();
      console.log(`   Status: ${verifyResponse.status}`);
      console.log(`   Message: ${verifyData.message}`);
      
      if (verifyResponse.status === 400 && verifyData.message === 'Invalid verification token') {
        console.log('✅ Invalid token correctly rejected\n');
      } else {
        console.log('❌ Invalid token was not properly rejected\n');
      }
    } else {
      console.log('❌ Send verification email failed\n');
    }

  } catch (error) {
    console.log(`❌ Flow test failed: ${error.message}\n`);
  }

  console.log('🏁 Token validation test completed!');
}

// Run the test
testTokenValidation().catch(console.error);
