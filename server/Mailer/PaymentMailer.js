// mailers/paymentMailer.js
const { sendMail } = require('./NodeMailer');

exports.paymentMailer = async (course, email, name, amount, refNo) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${name},</h2>
      <p>This is to confirm your payment for the <strong>${course}</strong> course.</p>
      <ul>
        <li><strong>Amount:</strong> Rs. ${amount}</li>
        <li><strong>Reference No:</strong> ${refNo}</li>
      </ul>
      <p>Thank you for choosing <strong>Wiseway Academy</strong>.</p>
      <hr />
      <p style="font-size: 0.85rem; color: #555;">This is an automated message. Please do not reply.</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject: `Payment Confirmation - ${course}`,
    html: htmlContent,
  });
};
