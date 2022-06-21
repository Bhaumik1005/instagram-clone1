const nodemailer = require("nodemailer"); //Email Service Provider
const dotenv = require("dotenv").config();
const userEmail = process.env.UserEmail;
const userPass = process.env.UserPass;

//Create Email Transporter 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userEmail,
    pass: userPass,
  },
});

//Email Function 
exports.mailer = (data) => {
  const mailOptions = {
    from: userEmail,
    to: data.to,
    subject: data.subject,
    html: data.HTML,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("ERRRRRR>>>>>>>>.", err);
      return;
    }
  });
};
