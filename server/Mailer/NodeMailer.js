// utils/mailer.js
const nodemailer = require('nodemailer');
const dns = require('dns');
require('dotenv').config();

// ─── Connectivity Check ────────────────────────────────────────────────────────
// Does a fast DNS lookup (< 3s timeout) to check for internet access.
// All mailer functions call this first and bail out silently if offline.
function isOnline() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 3000);
    dns.lookup('smtp.ethereal.email', (err) => {
      clearTimeout(timeout);
      resolve(!err);
    });
  });
}

// ─── Transporter ───────────────────────────────────────────────────────────────
// Ethereal accounts are ephemeral and expire.
// We create a fresh test account on startup so credentials are always valid.
let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();
  console.log(`📧 Ethereal test account created:`);
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Pass: ${testAccount.pass}`);
  console.log(`   Login at: https://ethereal.email/login`);

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

// ─── sendTextMail ──────────────────────────────────────────────────────────────
exports.sendTextMail = async ({ to, subject, html }) => {
  if (!(await isOnline())) {
    console.warn(`⚠️  No internet connection — skipping email to ${to}`);
    return null;
  }

  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: `"WiseWay Academy" <no-reply@wisewayacademy.com>`,
      to: to,
      subject: subject,
      html: html
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    throw err;
  }
};

// ─── sendFileMail ──────────────────────────────────────────────────────────────
exports.sendFileMail = async ({ to, subject, emailContent }) => {
  if (!(await isOnline())) {
    console.warn(`⚠️  No internet connection — skipping file email to ${to}`);
    return null;
  }

  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: emailContent,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log(`✅ Timetable email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send timetable email to ${to}:`, err);
    throw err;
  }
};