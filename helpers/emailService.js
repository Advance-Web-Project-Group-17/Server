import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "group17Oamk@gmail.com",
      pass: "otgfxeubmltabwnm",
    },
  });

  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

  const confirmationUrl = `${process.env.BASE_URL}/user/confirm/${token}`;
  const mailOptions = {
    from: "group17Oamk@gmail.com",
    to: email,
    subject: "Confirm Your Registration",
    text: `Please confirm your registration by clicking the link: ${confirmationUrl}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error in sending email  " + error);
      return true;
    } else {
      console.log("Email sent: " + info.response);
      return false;
    }
  });
};
