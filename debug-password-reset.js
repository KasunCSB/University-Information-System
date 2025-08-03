#!/usr/bin/env node

// Debug script for password reset functionality
const API_URL = 'http://localhost:3001/api';

async function debugPasswordReset() {
  console.log('🔍 Debugging Password Reset Functionality...\n');

  // Test email for password reset
  const testEmail = 'existing@example.com';
  
  console.log('Step 1: Testing password reset request endpoint...');
  
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
    console.log(`Response:`, data);
    
    if (response.ok) {
      console.log('✅ Password reset request endpoint is working');
      
      if (data.success) {
        console.log('✅ Backend processed the request successfully');
        console.log(`📧 Message: ${data.message}`);
        
        // Check if this indicates email was sent
        if (data.message.toLowerCase().includes('sent')) {
          console.log('✅ Backend indicates email was sent');
        } else {
          console.log('⚠️  Backend message suggests email might not exist');
        }
      } else {
        console.log('❌ Backend returned failure:', data.message);
      }
    } else {
      console.log('❌ Password reset request failed');
      console.log('Error:', data.message || 'Unknown error');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\nStep 2: Testing with a definitely non-existent email...');
  
  try {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'nonexistent@example.com' })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
    // Should still say "sent" for security reasons
    if (data.success && data.message.toLowerCase().includes('sent')) {
      console.log('✅ Security: Backend doesn\'t reveal if email exists');
    } else {
      console.log('⚠️  Backend might be revealing too much information');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('\nStep 3: Testing backend environment variables...');
  
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET'
    });

    if (response.ok) {
      console.log('✅ Backend is running and healthy');
      
      // Check if we can get any config info (don't expose sensitive data)
      console.log('\n🔧 Email Configuration Check:');
      console.log('Note: For security, sensitive config is not exposed via API');
      console.log('You should manually check backend/.env for:');
      console.log('- EMAIL_USER (should be your Gmail address)');
      console.log('- EMAIL_PASS (should be your app password)');
      console.log('- EMAIL_FROM (should be a valid email)');
      console.log('- FRONTEND_URL (should be http://localhost:3000)');
      
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Backend appears to be down:', error.message);
  }

  console.log('\nStep 4: Testing email validation...');
  
  const invalidEmails = ['', 'invalid-email', 'test@', '@domain.com'];
  
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
        if (data.message) {
          console.log(`   Reason: ${data.message}`);
        }
      } else {
        console.log(`⚠️  Invalid email "${email}" was accepted (status: ${response.status})`);
        if (data.message) {
          console.log(`   Response: ${data.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error testing invalid email "${email}":`, error.message);
    }
  }

  console.log('\n📋 DEBUGGING CHECKLIST:');
  console.log('1. ✓ Check if backend is running on port 3001');
  console.log('2. ⚠️  Check backend/.env file for email configuration');
  console.log('3. ⚠️  Verify Gmail app password is correct');
  console.log('4. ⚠️  Check email service logs in backend console');
  console.log('5. ⚠️  Test with a real email address you control');
  console.log('6. ⚠️  Check spam/junk folder in your email');
  
  console.log('\n🏁 Password reset debugging completed!');
}

// Run the debug
debugPasswordReset().catch(console.error);
