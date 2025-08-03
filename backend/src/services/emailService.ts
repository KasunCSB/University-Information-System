import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import logger from '../config/logger.js';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection on startup
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified successfully');
    } catch (error: unknown) {
      logger.error('Email service connection failed:', error);
      logger.error(`EMAIL_USER: ${config.EMAIL_USER ? 'Set' : 'Not set'}`);
      logger.error(`EMAIL_PASS: ${config.EMAIL_PASS ? 'Set' : 'Not set'}`);
    }
  }

  async sendEmailVerification(email: string, token: string, username: string): Promise<void> {
    if (!email || !token || !username) {
      throw new Error('Missing required parameters for email verification');
    }

    // Decode JWT to get expiration for URL parameter
    let expirationTime: number;
    try {
      const decoded = jwt.decode(token) as { exp?: number };
      expirationTime = decoded?.exp || (Math.floor(Date.now() / 1000) + (24 * 60 * 60));
    } catch (error) {
      logger.error('Failed to decode JWT token for expiration:', error);
      expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // fallback to 24 hours
    }

    const verificationUrl = `${config.FRONTEND_URL}/complete-registration?token=${token}&expires=${expirationTime}`;
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Complete Your UIS Account Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to UIS!</h2>
          <p>Thank you for starting your registration with the University Information System.</p>
          <p>Click the secure verification link below to complete your account setup:</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h3 style="margin: 0 0 10px 0; color: #2563eb;">Complete Your Registration</h3>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; display: inline-block;
                        font-weight: bold; font-size: 16px;">
                Complete Account Setup
              </a>
            </div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px; text-align: center;">
              This link will take you to a secure page where you can set your username, password, and role.
            </p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <h3 style="margin: 0 0 10px 0; color: #0ea5e9;">Security Information</h3>
            <p style="margin: 10px 0; color: #666; font-size: 14px;">
              🔒 This email contains a secure JWT token for verification<br/>
              🚫 We don't use 6-digit codes for enhanced security<br/>
              ⏰ This link will expire in 24 hours for your security<br/>
              📅 Expires: ${new Date(expirationTime * 1000).toLocaleString()}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb; font-size: 12px; background-color: #f1f5f9; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email verification sent to ${email}, Message ID: ${info.messageId}, Expires: ${new Date(expirationTime * 1000).toISOString()}`);
    } catch (error) {
      logger.error('Error sending email verification:', error);
      // Check if it's a connection error and provide specific error message
      if (error instanceof Error) {
        if (error.message.includes('auth') || error.message.includes('authentication')) {
          throw new Error('Email authentication failed - please check email configuration');
        } else if (error.message.includes('connect') || error.message.includes('ETIMEDOUT')) {
          throw new Error('Failed to connect to email server - please try again later');
        }
      }
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordReset(email: string, token: string, username: string): Promise<void> {
    if (!email || !token || !username) {
      throw new Error('Missing required parameters for password reset email');
    }

    logger.info(`🔄 Password reset email requested for: ${email}`);
    logger.info(`📧 Using email config - From: ${config.EMAIL_FROM}, User: ${config.EMAIL_USER}`);
    
    const resetUrl = `${config.FRONTEND_URL}/create-new-password?token=${token}`;
    logger.info(`🔗 Password reset URL: ${resetUrl}`);
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Reset Your UIS Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello ${username},</p>
          <p>You requested a password reset for your UIS account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
          </p>
          <p style="color: #666; font-size: 12px;">
            For security, this email was sent from: ${config.EMAIL_FROM}
          </p>
        </div>
      `
    };

    try {
      logger.info(`📤 Attempting to send password reset email to: ${email}`);
      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`✅ Password reset email sent successfully to ${email}`);
      logger.info(`📧 Message ID: ${result.messageId}`);
      logger.info(`📊 Email response: ${JSON.stringify(result.response)}`);
    } catch (error: unknown) {
      logger.error(`❌ Failed to send password reset email to: ${email}`);
      logger.error('📧 Email sending error:', error);
      logger.error('⚙️  Email config check:', {
        from: config.EMAIL_FROM,
        to: email,
        emailUser: config.EMAIL_USER ? 'Set' : 'Not set',
        emailPass: config.EMAIL_PASS ? 'Set' : 'Not set',
        frontendUrl: config.FRONTEND_URL
      });
      
      // Provide specific error messages like in email verification
      if (error instanceof Error) {
        if (error.message.includes('auth') || error.message.includes('authentication')) {
          throw new Error('Email authentication failed - please check email configuration');
        } else if (error.message.includes('connect') || error.message.includes('ETIMEDOUT')) {
          throw new Error('Failed to connect to email server - please try again later');
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send password reset email: ${errorMessage}`);
    }
  }

  async sendPasswordChangeNotification(email: string, username: string): Promise<void> {
    if (!email || !username) {
      throw new Error('Missing required parameters for password change notification');
    }

    logger.info(`🔄 Sending password change notification to: ${email}`);
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Password Changed - UIS Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Changed Successfully</h2>
          <p>Hello ${username},</p>
          <p>Your password for your UIS account has been successfully changed.</p>
          
          <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #374151;">
              <strong>✅ Security Notice:</strong> Your password was changed on ${new Date().toLocaleString()}.
            </p>
          </div>
          
          <p>If you did not make this change, please contact our support team immediately or reset your password again.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated security notification from the University Information System.
          </p>
          <p style="color: #666; font-size: 12px;">
            For security, this email was sent from: ${config.EMAIL_FROM}
          </p>
        </div>
      `
    };

    try {
      logger.info(`📤 Attempting to send password change notification to: ${email}`);
      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`✅ Password change notification sent successfully to ${email}`);
      logger.info(`📧 Message ID: ${result.messageId}`);
    } catch (error: unknown) {
      logger.error(`❌ Failed to send password change notification to: ${email}`);
      logger.error('📧 Email sending error:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('auth') || error.message.includes('authentication')) {
          throw new Error('Email authentication failed - please check email configuration');
        } else if (error.message.includes('connect') || error.message.includes('ETIMEDOUT')) {
          throw new Error('Failed to connect to email server - please try again later');
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send password change notification: ${errorMessage}`);
    }
  }
}

export default new EmailService();
