// testEmail.js
const mailsender = require('./NodeMailer.js'); // path to your mailsender.js

// Test data
const course = "Physics";
const email = "dhyansithru@gmail.com"; // replace with your email
const name = "John Doe";
const amount = 5000;
const refNo = "20250930-ABC123";

const testEmail = async () => {
  try {
    await mailsender.mailsender(course, email, name, amount, refNo);
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Error sending test email:", err);
  }
};

testEmail();
