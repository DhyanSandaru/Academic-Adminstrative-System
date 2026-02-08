// mailers/registrationMailer.js
const { sendTextMail } = require('./NodeMailer.js');

exports.registrationMailer = async (email, name, studentId, grade, examYear) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #004aad;">Welcome to Wiseway Academy, ${name}!</h2>

      <p>We are excited to have you onboard as a valued student of <strong>Wiseway Academy</strong>.</p>

      <p>Your registration for the academic year <strong>${examYear}</strong> has been successfully completed.</p>

      <div style="margin: 16px 0;">
        <p><strong>Student ID:</strong> ${studentId}</p>
        <p><strong>Grade:</strong> ${grade}</p>
      </div>

      <p>Our academic team will contact you shortly with your class schedule and course details.</p>
      
      <p style="margin-top: 24px;">We wish you all the best on your academic journey with us!</p>

      <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 0.85rem; color: #777;">
        This is an automated email from Wiseway Academy. Please do not reply to this message.
      </p>
    </div>
  `;

  await sendTextMail({
    to: email,
    subject: `Registration Confirmation - Wiseway Academy`,
    html: htmlContent,
  });
};
