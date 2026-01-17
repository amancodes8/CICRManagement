const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("SMTP credentials missing");
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    pool: true, // Use pooling for cloud environments
    maxConnections: 1,
    maxMessages: Infinity,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Increased timeouts for Render's network
    connectionTimeout: 10000, // 20 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
  });

  const mailOptions = {
    from: `"CICR Connect" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Success: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Error Logged:");
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code}`);
    throw error;
  }
};

module.exports = sendEmail;