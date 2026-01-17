const nodemailer = require('nodemailer');

/**
 * @desc Utility to send emails via Nodemailer
 * Optimized for Render.com and Gmail SMTP
 * @param {Object} options - { email, subject, message }
 */
const sendEmail = async (options) => {
  // 1. Validation: Ensure required environment variables are present
  // Note: EMAIL_PASS must be a 16-digit Google App Password
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_PASS is missing in Environment Variables");
    throw new Error("SMTP credentials not configured on server.");
  }

  // 2. Clean the Host: In case MAIL_HOST contains a URL redirect
  // We want strictly 'smtp.gmail.com'
  const smtpHost = 'smtp.gmail.com'; 

  // 3. Create Transporter
  // We use Port 465 (Secure SSL) because Port 587 is frequently blocked on Cloud Providers
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true, // Required for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // 4. Reliability Settings: Prevent "Connection Timeout" on Render
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 15000,
    tls: {
      // Do not fail on invalid certs (helpful for shared cloud hosting IPs)
      rejectUnauthorized: false,
    },
  });

  // 5. Define Mail Content
  const mailOptions = {
    from: `"CICR Connect" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Accepts HTML templates
  };

  // 6. Execute Send
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Dispatched Successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    // Log detailed error for Render logs
    console.error("❌ Nodemailer Error Logged:");
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    // Throw error so the controller can send a 500 status to the frontend
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;