#!/usr/bin/env node

// Simple single password reset test
const API_URL = 'http://localhost:3001/api';

async function testSinglePasswordReset() {
  console.log('🔍 Testing Single Password Reset...\n');

  // Use a real email for testing
  const testEmail = 'noreply.lk.uis@gmail.com';
  
  console.log(`Testing with email: ${testEmail}`);
  
  try {
    console.log('Making request to:', `${API_URL}/auth/request-password-reset`);
    
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    });

    console.log(`Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('✅ Password reset request successful!');
      console.log('📧 Check your email inbox (and spam folder) for the reset link');
      console.log('💡 If no email arrives, check backend logs for email service errors');
    } else {
      console.log('❌ Password reset request failed');
      console.log('Possible issues:');
      console.log('- Email service configuration error');
      console.log('- Rate limiting (wait a few minutes and try again)');
      console.log('- Gmail app password issues');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Make sure the backend is running on port 3001');
    console.log('💡 Try: npm run dev in the backend directory');
  }
}

// Run the test
testSinglePasswordReset().catch(console.error);
