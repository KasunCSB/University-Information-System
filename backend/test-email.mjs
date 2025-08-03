#!/usr/bin/env node

// Test script for email configuration - runs from backend directory
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from current directory
dotenv.config();

async function testEmailConfig() {
  console.log('🧪 Testing Email Configuration...\n');
  
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  
  console.log('Environment Variables:');
  console.log(`EMAIL_USER: ${EMAIL_USER ? 'Set (' + EMAIL_USER + ')' : 'Not set'}`);
  console.log(`EMAIL_PASS: ${EMAIL_PASS ? 'Set (length: ' + EMAIL_PASS.length + ')' : 'Not set'}`);
  console.log(`EMAIL_FROM: ${EMAIL_FROM || 'Not set'}\n`);
  
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('❌ EMAIL_USER or EMAIL_PASS not configured in .env');
    console.log('Make sure you have these in your backend/.env file:');
    console.log('EMAIL_USER=your-gmail@gmail.com');
    console.log('EMAIL_PASS=your-app-password');
    return;
  }
  
  console.log('Creating transporter...');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  console.log('Verifying connection...');
  
  try {
    await transporter.verify();
    console.log('✅ Email connection verified successfully!');
    
    // Test sending an actual email
    console.log('\nSending test email...');
    
    const testEmail = EMAIL_USER; // Send to yourself
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: testEmail,
      subject: 'UIS Password Reset Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Test</h2>
          <p>Hello,</p>
          <p>This is a test email to verify that password reset emails can be sent.</p>
          <p>Time: ${new Date().toISOString()}</p>
          <p>If you received this, your email configuration is working correctly.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/create-new-password?token=test123" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Test Reset Link
            </a>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent successfully!`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Check your email (${testEmail}) for the test message.`);
    console.log(`Don't forget to check spam/junk folder!`);
    
  } catch (error) {
    console.log('❌ Email connection failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SOLUTION: Your Gmail app password might be incorrect.');
      console.log('1. Go to https://myaccount.google.com/');
      console.log('2. Go to Security > 2-Step Verification');
      console.log('3. Scroll down to App passwords');
      console.log('4. Generate a new App Password for "Mail"');
      console.log('5. Use that 16-character password (no spaces) in EMAIL_PASS');
      console.log('6. Make sure 2-factor authentication is enabled on your Google account');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 SOLUTION: Network/DNS issue. Check your internet connection.');
    }
    
    if (error.message.includes('self signed certificate')) {
      console.log('\n💡 SOLUTION: SSL certificate issue.');
    }
    
    console.log('\nFull error details:', error);
  }
  
  console.log('\n🏁 Email configuration test completed!');
}

testEmailConfig().catch(console.error);
