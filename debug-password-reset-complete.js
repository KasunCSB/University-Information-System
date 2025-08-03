#!/usr/bin/env node

// Comprehensive password reset flow debug script
const API_URL = 'http://localhost:3001/api';

async function debugPasswordResetFlow() {
  console.log('🔍 Debugging Complete Password Reset Flow...\n');

  // Use a real email that should exist
  const testEmail = 'noreply.lk.uis@gmail.com'; // Using the same email from config
  
  console.log('=== STEP 1: Request Password Reset ===');
  
  try {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.log('❌ Password reset request failed');
      if (response.status === 400) {
        console.log('💡 This might be a validation error');
      } else if (response.status === 500) {
        console.log('💡 This might be an email service configuration issue');
      }
      return;
    }
    
    if (data.success) {
      console.log('✅ Password reset request successful');
      console.log(`📧 Message: ${data.message}`);
    } else {
      console.log('❌ Password reset request failed on backend');
      return;
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('💡 Make sure the backend is running on port 3001');
    return;
  }

  console.log('\n=== STEP 2: Test Invalid Email Validation ===');
  
  const invalidEmails = [
    '', 
    'invalid-email', 
    'test@', 
    '@domain.com',
    'spaces in email@test.com'
  ];
  
  for (const email of invalidEmails) {
    try {
      const response = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.status === 400) {
        console.log(`✅ Invalid email "${email}" correctly rejected: ${data.message}`);
      } else {
        console.log(`⚠️  Invalid email "${email}" was accepted (status: ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Error testing invalid email "${email}":`, error.message);
    }
  }

  console.log('\n=== STEP 3: Test Password Reset Token Validation ===');
  
  const testTokens = [
    '', // Empty token
    'short', // Too short
    'a'.repeat(63), // 63 chars (should be 64)
    'a'.repeat(65), // 65 chars (should be 64)
    'z'.repeat(64), // 64 chars but invalid hex
    'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg', // 64 chars but invalid hex
    'abcdef1234567890'.repeat(4), // Valid 64 char hex
  ];
  
  for (const token of testTokens) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token, 
          newPassword: 'NewPass123!' 
        })
      });

      const data = await response.json();
      
      console.log(`Token "${token.substring(0, 10)}...": Status ${response.status} - ${data.message}`);
      
    } catch (error) {
      console.log(`❌ Error testing token "${token.substring(0, 10)}...":`, error.message);
    }
  }

  console.log('\n=== STEP 4: Test Frontend Flow URLs ===');
  
  const frontendUrls = [
    'http://localhost:3000/forgot-password',
    'http://localhost:3000/create-new-password?token=test123'
  ];
  
  for (const url of frontendUrls) {
    try {
      const response = await fetch(url, { method: 'GET' });
      
      if (response.ok) {
        console.log(`✅ Frontend route accessible: ${url}`);
      } else {
        console.log(`❌ Frontend route failed: ${url} (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Frontend route error: ${url} - ${error.message}`);
    }
  }

  console.log('\n=== STEP 5: Backend Health Check ===');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data);
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Backend is not responding:', error.message);
  }

  console.log('\n📋 DEBUGGING SUMMARY:');
  console.log('1. Check backend logs for email service errors');
  console.log('2. Verify EMAIL_USER and EMAIL_PASS in backend/.env');
  console.log('3. Check if Gmail app password is correct (16 characters)');
  console.log('4. Ensure 2FA is enabled on the Gmail account');
  console.log('5. Check spam/junk folder for password reset emails');
  console.log('6. Verify frontend routing is working');
  
  console.log('\n🔧 COMMON FIXES:');
  console.log('- Regenerate Gmail app password');
  console.log('- Check firewall/antivirus blocking SMTP');
  console.log('- Verify network connectivity');
  console.log('- Check if EMAIL_FROM matches EMAIL_USER');
  
  console.log('\n🏁 Password reset flow debug completed!');
}

// Run the debug
debugPasswordResetFlow().catch(console.error);
