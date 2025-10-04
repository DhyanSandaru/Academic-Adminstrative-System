const nodemailer = require('nodemailer');
require('dotenv').config();

exports.mailSender = async (course, email, name, amount, refNo) => {
  const htmlContent = `
    <h2>Hello ${name},</h2>
    <p>This is to confirm your payment for the <strong>${course}</strong> course.</p>
    <ul>
      <li><strong>Amount:</strong> Rs. ${amount}</li>
      <li><strong>Reference No:</strong> ${refNo}</li>
    </ul>
    <p>Thank you for choosing Wiseway Academy.</p>
  `;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'adclicker768@gmail.com',
      pass: process.env.GMAIL_APP_PW
    }
  });

  try {
    await transporter.sendMail({
      to: email,
      subject: "Payment Confirmation",
      html: htmlContent
    });
    console.log("✅ Email sent");
  } catch (err) {
    console.error(" Failed to send email:", err);
    throw err; //  Propagate error to the controller
  }
};
