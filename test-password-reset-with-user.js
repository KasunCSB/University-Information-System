#!/usr/bin/env node

// Comprehensive password reset test with user creation
const API_URL = 'http://localhost:3001/api';

async function testPasswordResetWithUserCreation() {
  console.log('🔍 Testing Complete Password Reset Flow with User Creation...\n');

  const testUser = {
    username: 'testuser_' + Date.now(),
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };

  console.log('=== STEP 1: Create Test User ===');
  console.log(`Creating user: ${testUser.username} with email: ${testUser.email}`);
  
  try {
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log(`Registration Status: ${registerResponse.status}`);
    console.log(`Registration Response:`, JSON.stringify(registerData, null, 2));

    if (!registerResponse.ok) {
      console.log('❌ User creation failed, stopping test');
      return;
    }

    console.log('✅ Test user created successfully');

  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return;
  }

  // Wait a moment for user to be saved
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n=== STEP 2: Test Password Reset for Existing User ===');
  
  try {
    const resetResponse = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testUser.email })
    });

    const resetData = await resetResponse.json();
    
    console.log(`Reset Status: ${resetResponse.status}`);
    console.log(`Reset Response:`, JSON.stringify(resetData, null, 2));
    
    if (resetResponse.ok && resetData.success) {
      if (resetData.message === 'Password reset link sent to your email') {
        console.log('✅ SUCCESS! Password reset email should have been sent');
        console.log('📧 Check your email inbox and spam folder');
      } else {
        console.log('⚠️  Got generic security message - user might not have been found');
      }
    } else {
      console.log('❌ Password reset request failed');
    }

  } catch (error) {
    console.log('❌ Password reset error:', error.message);
  }

  console.log('\n=== STEP 3: Test Password Reset for Non-existent User ===');
  
  const nonExistentEmail = 'definitely.does.not.exist.' + Date.now() + '@nonexistent.com';
  
  try {
    const resetResponse = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: nonExistentEmail })
    });

    const resetData = await resetResponse.json();
    
    console.log(`Non-existent email test:`);
    console.log(`Status: ${resetResponse.status}`);
    console.log(`Message: ${resetData.message}`);
    
    if (resetData.message === 'If the email exists, a password reset link has been sent') {
      console.log('✅ Correct security response for non-existent email');
    } else {
      console.log('⚠️  Unexpected response for non-existent email');
    }

  } catch (error) {
    console.log('❌ Error testing non-existent email:', error.message);
  }

  console.log('\n=== STEP 4: Test Invalid Email Formats ===');
  
  const invalidEmails = [
    '',
    'invalid-email',
    'test@',
    '@domain.com',
    'spaces in email@test.com',
    'no-domain@',
    '@no-user.com'
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
        console.log(`✅ Invalid email "${email}" correctly rejected`);
      } else {
        console.log(`⚠️  Invalid email "${email}" was accepted (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Error testing invalid email "${email}":`, error.message);
    }
  }

  console.log('\n📋 SUMMARY & DEBUGGING STEPS:');
  console.log('1. ✅ Test user created and verified');
  console.log('2. ✅ Password reset flow tested with existing user');
  console.log('3. ✅ Security tested with non-existent user');
  console.log('4. ✅ Input validation tested');
  
  console.log('\n📧 TO VERIFY EMAIL WAS SENT:');
  console.log(`1. Check email inbox for: ${testUser.email}`);
  console.log('2. Check spam/junk folder');
  console.log('3. Look at backend logs for detailed email sending information');
  console.log('4. Check Gmail "Sent" folder if using same sending email');
  
  console.log('\n🔧 IF NO EMAIL ARRIVES:');
  console.log('- Check backend logs for email service errors');
  console.log('- Verify EMAIL_USER and EMAIL_PASS in backend/.env');
  console.log('- Regenerate Gmail app password');
  console.log('- Check if EMAIL_FROM matches EMAIL_USER');
  console.log('- Verify 2FA is enabled on Gmail account');
  
  console.log('\n🏁 Complete password reset test finished!');
  console.log(`Test user email: ${testUser.email}`);
}

// Run the test
testPasswordResetWithUserCreation().catch(console.error);
