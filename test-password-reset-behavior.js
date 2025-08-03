#!/usr/bin/env node

// Test the actual password reset flow by monitoring backend behavior
const API_URL = 'http://localhost:3001/api';

async function testPasswordResetFlow() {
  console.log('🔍 Testing Actual Password Reset Flow...\n');

  // Test with a real email that should exist in the database
  const testEmail = 'noreply.lk.uis@gmail.com';
  
  console.log('=== STEP 1: Test Password Reset Request ===');
  console.log(`Testing with email: ${testEmail}`);
  
  try {
    console.log('Making request to:', `${API_URL}/auth/request-password-reset`);
    
    const startTime = Date.now();
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`Response time: ${responseTime}ms`);
    console.log(`Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ API request successful!');
      
      // Check response time - if it's too fast, it might be mocked
      if (responseTime < 100) {
        console.log('⚠️  Very fast response time - might indicate mocked behavior');
      } else if (responseTime > 500) {
        console.log('✅ Reasonable response time - likely making real email calls');
      }
      
    } else {
      console.log('❌ API request failed');
      return;
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Make sure the backend is running on port 3001');
    return;
  }

  console.log('\n=== STEP 2: Test with Non-existent Email ===');
  
  const nonExistentEmail = 'definitely-does-not-exist-12345@nonexistent-domain.com';
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: nonExistentEmail })
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const data = await response.json();
    
    console.log(`Non-existent email test:`);
    console.log(`Response time: ${responseTime}ms`);
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${data.message}`);
    
    // Both should return the same message for security
    if (data.message === "If the email exists, a password reset link has been sent") {
      console.log('✅ Correct security response for non-existent email');
    } else {
      console.log('⚠️  Different response for non-existent email - potential security issue');
    }
    
  } catch (error) {
    console.log('❌ Error testing non-existent email:', error.message);
  }

  console.log('\n=== STEP 3: Test Rate Limiting ===');
  
  console.log('Making multiple rapid requests to test rate limiting...');
  
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: testEmail })
      });
      
      console.log(`Request ${i + 1}: Status ${response.status}`);
      
      if (response.status === 429) {
        console.log('✅ Rate limiting is working (this is expected)');
        break;
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`Request ${i + 1} failed:`, error.message);
    }
  }

  console.log('\n📋 ANALYSIS:');
  console.log('1. Check if response times indicate real email service calls');
  console.log('2. Verify both existing and non-existent emails get same response');
  console.log('3. Check if rate limiting is protecting the endpoint');
  console.log('4. Look for backend logs showing email service activity');
  
  console.log('\n💡 TO VERIFY EMAIL IS ACTUALLY SENT:');
  console.log('1. Check the email inbox (including spam folder)');
  console.log('2. Look at backend logs for email service messages');
  console.log('3. Try with a different email address you control');
  console.log('4. Check Gmail "Sent" folder if using the same email');
  
  console.log('\n🏁 Password reset flow test completed!');
}

// Run the test
testPasswordResetFlow().catch(console.error);
