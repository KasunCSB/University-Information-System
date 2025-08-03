#!/usr/bin/env node

// Quick test to check if there are users in the database
const API_URL = 'http://localhost:3001/api';

async function checkExistingUsers() {
  console.log('🔍 Checking for existing users in database...\n');
  
  // Test with some common email addresses that might exist
  const testEmails = [
    'admin@university.com',
    'test@test.com', 
    'user@example.com',
    'admin@admin.com',
    'test@university.com'
  ];
  
  for (const email of testEmails) {
    try {
      console.log(`Testing password reset for: ${email}`);
      
      const response = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Message: ${data.message}`);
      
      if (data.message === 'Password reset link sent to your email') {
        console.log(`  🎯 USER EXISTS! Email sent to: ${email}`);
      } else if (data.message === 'If the email exists, a password reset link has been sent') {
        console.log(`  🔒 Security response (user might not exist): ${email}`);
      }
      
      console.log('');
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`  ❌ Error testing ${email}:`, error.message);
    }
  }
  
  console.log('📧 Check backend logs for detailed information about which emails triggered actual sending attempts');
  console.log('🏁 Existing user check completed!');
}

// Run the check
checkExistingUsers().catch(console.error);
