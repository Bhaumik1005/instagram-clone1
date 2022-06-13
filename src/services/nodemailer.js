const nodemailer = require("nodemailer"); //Email Service Provider

//Email Functionality
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhaumikjoshi1052@gmail.com",
    pass: "ytfzekwoyuatxbzb",
  },
});

exports.mailer = (data) => {
  const mailOptions = {
    from: "bhaumikjoshi1052@gmail.com",
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
