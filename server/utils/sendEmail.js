import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    });

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};