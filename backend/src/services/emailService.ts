import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../config/logger.js';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      },
      secure: true
    });
  }

  async sendEmailVerification(email: string, token: string, username: string): Promise<void> {
    const verificationUrl = `${config.FRONTEND_URL}/email-verification?token=${token}`;
    
    const mailOptions = {
      from: `"UIS - University Information System" <${config.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your UIS Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to UIS, ${username}!</h2>
          <p>Thank you for registering with the University Information System.</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Email verification sent to ${email}`);
    } catch (error) {
      logger.error('Error sending email verification:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordReset(email: string, token: string, username: string): Promise<void> {
    const resetUrl = `${config.FRONTEND_URL}/create-new-password?token=${token}`;
    
    const mailOptions = {
      from: `"UIS - University Information System" <${config.EMAIL_USER}>`,
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
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export default new EmailService();
