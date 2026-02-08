const { sendTextMail } = require('./NodeMailer');

exports.TimetableMailer = async({
  to,
  module, 
  studentName, 
  oldDate,
  oldStartTime,
  oldEndTime,
  newDate,
  newStartTime,
  newEndTime }) => {

    try{
      const emailHTML = `
    <h4>Good Day ${studentName},</h4>

    <p>
    We would like to inform you that the schedule for the <strong>${module}</strong> module at <strong>WiseWay Academy</strong> has been updated.
    </p>

    <p><strong>Previous Schedule:</strong></p>
    <ul>
      <li><strong>Date:</strong> ${oldDate}</li>
      <li><strong>Time:</strong> ${oldStartTime} – ${oldEndTime}</li>
    </ul>

    <p><strong>Updated Schedule:</strong></p>
    <ul>
      <li><strong>Date:</strong> ${newDate}</li>
      <li><strong>Time:</strong> ${newStartTime} – ${newEndTime}</li>
    </ul>

    <p>
    Please ensure that you make the necessary adjustments to your schedule accordingly. We appreciate your cooperation and understanding.
    </p>

    <p>
    If you require further clarification, please contact the academy administration through the official communication channels.
    </p>

    <p style="font-size: 12px; color: #666;">
    This is an automated message. Please do not reply to this email.
    </p>

    <p>
    Kind regards,<br/>
    <strong>WiseWay Academy</strong>
    </p>

    `;

    await sendTextMail({
        to: to,
        subject: "Weekly Timetable Updates",
        html: emailHTML
    })
    }
    catch(err){
      console.error(`❌ Failed to send email to ${to}:`, err);
    }
    

}