const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "SafeHer <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log("Email sent to:", to);
  } catch (err) {
    console.log("EMAIL FAILED to", to, "-", err.message);
  }
};

module.exports = sendEmail;