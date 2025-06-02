export function generateOtpEmailTemplate(verificationCode) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="font-size: 16px; color: #555;">Dear User,</p>
        <p style="font-size: 16px; color: #555;">
          To complete your registration or login, please use the following One-Time Password (OTP):
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #276ef1; padding: 10px 20px; background: #eaf0ff; border-radius: 5px;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 16px; color: #555;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
        <p style="font-size: 16px; color: #555;">If you did not request this email, please ignore it.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
          <p>Thank you,<br><strong>BookStack Team</strong></p>
          <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `;
  }
  
  export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">Dear User,</p>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. Click the button below to proceed:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetPasswordUrl}" style="background-color: #276ef1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 16px; color: #555;">If you didn’t request this, you can safely ignore this email. This link will expire in 15 minutes.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
          <p>Thank you,<br><strong>BookStack Team</strong></p>
          <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `;
  }
  
  