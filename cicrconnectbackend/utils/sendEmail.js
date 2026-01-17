const nodemailer = require('nodemailer');

/**
 * @desc Utility to send emails via Nodemailer
 * @param {Object} options - { email, subject, message }
 */
const sendEmail = async (options) => {
  // 1. Ensure env variables exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_PASS not set in .env");
    throw new Error("SMTP credentials missing");
  }

  // 2. Create Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Google App Password here
    },
  });

  // 3. Define Mail Options
  const mailOptions = {
    from: `"CICR Connect" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Accepts HTML strings
  };

  // 4. Send the Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;