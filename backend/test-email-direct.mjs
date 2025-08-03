import { EmailService } from './src/services/emailService.js';
import config from './src/config/config.js';
import logger from './src/config/logger.js';

// Direct email service test
async function testEmailServiceDirectly() {
  console.log('🔧 Testing Email Service Directly...\n');
  
  // Check config
  console.log('📋 Configuration Check:');
  console.log(`EMAIL_USER: ${config.EMAIL_USER ? 'Set (' + config.EMAIL_USER + ')' : 'Not set'}`);
  console.log(`EMAIL_PASS: ${config.EMAIL_PASS ? 'Set (length: ' + config.EMAIL_PASS.length + ')' : 'Not set'}`);
  console.log(`EMAIL_FROM: ${config.EMAIL_FROM}`);
  console.log(`FRONTEND_URL: ${config.FRONTEND_URL}\n`);
  
  // Create email service instance
  console.log('⚡ Creating Email Service instance...');
  const emailService = new EmailService();
  
  // Wait a moment for connection verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n📧 Testing Password Reset Email...');
  
  const testEmail = 'noreply.lk.uis@gmail.com';
  const testToken = 'abcdef1234567890'.repeat(4); // 64 character hex token
  const testUsername = 'TestUser';
  
  try {
    console.log(`Sending password reset email to: ${testEmail}`);
    console.log(`Token: ${testToken}`);
    console.log(`Username: ${testUsername}`);
    
    await emailService.sendPasswordReset(testEmail, testToken, testUsername);
    
    console.log('✅ Password reset email sent successfully!');
    console.log('📱 Check your email inbox (and spam folder)');
    console.log(`🔗 Reset URL should be: ${config.FRONTEND_URL}/create-new-password?token=${testToken}`);
    
  } catch (error) {
    console.log('❌ Failed to send password reset email:');
    console.error(error);
    
    console.log('\n🔍 Debugging Information:');
    console.log('- Check Gmail app password (should be 16 characters)');
    console.log('- Verify 2FA is enabled on Gmail account');
    console.log('- Check network connectivity');
    console.log('- Verify EMAIL_FROM matches EMAIL_USER');
    console.log('- Check if antivirus/firewall is blocking SMTP');
  }
}

// Run the test
testEmailServiceDirectly().catch(console.error);
