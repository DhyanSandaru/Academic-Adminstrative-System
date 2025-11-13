// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,     // e.g. 'adclicker768@gmail.com'
    pass: process.env.GMAIL_APP_PW,   // Gmail App Password
  },
});

/**
 * Sends an email using the given parameters.
 * @param {Object} options
 * @param {string} options.to - Recipient email(s)
 * @param {string} options.subject - Subject line
 * @param {string} options.html - Email body (HTML content)
 */
exports.sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    throw err;
  }
};
