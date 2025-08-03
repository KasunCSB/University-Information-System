#!/usr/bin/env node

// Comprehensive test to verify password reset is working end-to-end
const API_URL = 'http://localhost:3001/api';

async function testCompletePasswordResetFlow() {
  console.log('🔍 Testing Complete Password Reset Flow...\n');

  // First, let's try to register a test user
  const testEmail = 'test.password.reset@example.com';
  const testPassword = 'TestPass123!';
  const testUsername = 'testuser';

  console.log('=== STEP 1: Create Test User ===');
  
  try {
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username: testUsername,
        email: testEmail, 
        password: testPassword 
      })
    });

    const registerData = await registerResponse.json();
    console.log(`Registration response: ${registerResponse.status}`);
    console.log(`Registration message: ${registerData.message}`);

    if (registerResponse.status === 400 && registerData.message.includes('already exists')) {
      console.log('✅ User already exists - proceeding with password reset test');
    } else if (registerResponse.ok) {
      console.log('✅ User created successfully');
    } else {
      console.log('⚠️  User creation failed, but continuing with test...');
    }

  } catch (error) {
    console.log('⚠️  Registration failed:', error.message);
    console.log('Continuing with password reset test anyway...');
  }

  console.log('\n=== STEP 2: Request Password Reset ===');
  
  try {
    console.log(`Testing password reset for: ${testEmail}`);
    
    const resetResponse = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail })
    });

    const resetData = await resetResponse.json();
    
    console.log(`Reset response status: ${resetResponse.status}`);
    console.log(`Reset response:`, JSON.stringify(resetData, null, 2));
    
    if (resetResponse.ok && resetData.success) {
      console.log('✅ Password reset request successful!');
      
      // Check if the specific success message indicates email was sent
      if (resetData.message === 'Password reset link sent to your email') {
        console.log('🎯 Specific success message - email should have been sent');
      } else if (resetData.message === 'If the email exists, a password reset link has been sent') {
        console.log('🔒 Security message - user might not exist in database');
      }
      
    } else {
      console.log('❌ Password reset request failed');
    }

  } catch (error) {
    console.log('❌ Password reset request error:', error.message);
  }

  console.log('\n=== STEP 3: Test Email Configuration ===');
  
  try {
    // Test if we can get any info about email configuration
    const configTestResponse = await fetch(`${API_URL}/auth/test-email-config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (configTestResponse.status === 404) {
      console.log('ℹ️  No email config test endpoint available');
    } else {
      const configData = await configTestResponse.json();
      console.log('Email config test:', configData);
    }

  } catch (error) {
    console.log('ℹ️  Email config test not available');
  }

  console.log('\n=== STEP 4: Check Backend Logs ===');
  console.log('Check the backend logs for:');
  console.log('- "🔄 Password reset email requested for: [email]"');
  console.log('- "📤 Attempting to send password reset email to: [email]"');
  console.log('- "✅ Password reset email sent successfully to [email]"');
  console.log('- "❌ Failed to send password reset email to: [email]"');
  
  console.log('\n📧 DEBUGGING STEPS:');
  console.log('1. Check if test user exists in database');
  console.log('2. Verify email service configuration');
  console.log('3. Check Gmail app password and 2FA settings');
  console.log('4. Look for email in spam/junk folder');
  console.log('5. Check backend error logs for SMTP issues');
  
  console.log('\n🔧 If emails are not being sent:');
  console.log('- Verify EMAIL_USER and EMAIL_PASS in backend/.env');
  console.log('- Regenerate Gmail app password');
  console.log('- Check if EMAIL_FROM matches EMAIL_USER');
  console.log('- Test SMTP connection manually');
  
  console.log('\n🏁 Complete password reset flow test finished!');
}

// Run the test
testCompletePasswordResetFlow().catch(console.error);
