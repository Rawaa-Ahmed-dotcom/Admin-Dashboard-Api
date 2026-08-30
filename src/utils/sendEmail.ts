import nodemailer from "nodemailer";


export const sendMail = async (options: {
  from: string;
  to: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    to: options.to,
    from: options.from,
    subject: options.subject,
    html: options.message
  };

  await transporter.sendMail(mailOptions);
};
