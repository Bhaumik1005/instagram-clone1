import nodemailer from "nodemailer";
import config  from "../config/config";


//Create Email Transporter 
const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
                    user: config.userEmail,
                    pass: config.userPass,
          },
});

//Email Function 
exports.mailer = (data) => {
          const mailOptions = {
                    from: config.userEmail,
                    to: data.to,
                    subject: data.subject,
                    html: data.HTML,
          };

          transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                              //       logger.error(`[${req.method}] [${req.originalUrl}] [${err}]`);
                              return err;
                    } else {
                              // logger.info(`Send Register Email to ${data.to}`);

                              return data.to;
                    }
          });
};
