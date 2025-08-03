#!/usr/bin/env node

// Simple script to test email configuration
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

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
    console.log('❌ EMAIL_USER or EMAIL_PASS not configured in backend/.env');
    return;
  }
  
  console.log('Creating transporter...');
  
  const transporter = nodemailer.createTransporter({
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
      subject: 'UIS Email Test',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from your University Information System.</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p>If you received this, your email configuration is working correctly.</p>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Test email sent successfully!`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Check your email (${testEmail}) for the test message.`);
    
  } catch (error) {
    console.log('❌ Email connection failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SOLUTION: Your Gmail app password might be incorrect.');
      console.log('1. Go to Google Account settings');
      console.log('2. Enable 2-factor authentication');
      console.log('3. Generate an App Password for "Mail"');
      console.log('4. Use that 16-character password in EMAIL_PASS');
    }
    
    if (error.message.includes('self signed certificate')) {
      console.log('\n💡 SOLUTION: SSL certificate issue. Try setting tls.rejectUnauthorized: false');
    }
  }
  
  console.log('\n🏁 Email configuration test completed!');
}

testEmailConfig().catch(console.error);
