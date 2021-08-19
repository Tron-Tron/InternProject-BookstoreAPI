import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
const mailService = async (from, to, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  return info;
};

export default mailService;
