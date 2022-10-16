import userModel from "../models/userModel";
import ejs from "ejs";
import path from "path";
import { mongoObjectId } from "mongodb";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailer from "../../utils/email";
import Compression from "../../utils/imageCompression";


export default class userAuthController {

          // static async signup(req, res) {
          //           try {
          //                     const finalImg = req.file;

          //                     if (finalImg) {
          //                               /* Image Compression Logic */
          //                               const ImageLink = await Compression.imageCompression(finalImg);

          //                               const user = new userModel(req.body);
          //                               const name = user.name;

          //                               /*Find User In DB*/
          //                               const checkEmail = await userModel.findOne({ email: req.body.email });

          //                               if (checkEmail) {
          //                                         res.status(500).send({
          //                                                   message: "Email already Registered",
          //                                         });
          //                               } else {
          //                                         /* Generate Email Token */
          //                                         const emailToken = Math.random().toString(6).substring(2);
          //                                         user.emailToken = emailToken;
          //                                         user.profilePic = ImageLink;

          //                                         /*Hash Password Generator */
          //                                         const salt = await bcrypt.genSalt(10); // generate salt to hash password
          //                                         password = await bcrypt.hash(user.password, salt); // now we set user password to hashed password
          //                                         user.password = password;
          //                                         await user.save();

          //                                         /*For Add HTML Template */
          //                                         const HTMlTEMP = await ejs.renderFile(
          //                                                   path.join(__dirname, "../view/pages/validation.ejs"),
          //                                                   { emailToken, name }
          //                                         );

          //                                         /*Add E-Mail Data */
          //                                         const data = {
          //                                                   to: user.email,
          //                                                   HTML: HTMlTEMP,
          //                                                   subject: "Validate User E-mail",
          //                                         };

          //                                         /* Add E-mailFunctinality */
          //                                         mailer.mailer(data);

          //                                         return res.status(201).send({
          //                                                   message: "Succesfully Add User Data Please Verify your E-mail",
          //                                         });
          //                               }
          //                     } else {
          //                               res.status(500).send({
          //                                         message: "Please Upload Your Profile Picture",
          //                               });
          //                     }
          //           } catch (error) {
          //                     console.log();
          //                     res.status(500).send({ error: error.message });
          //                     // logger.error(`${res.status}- ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
          //           }
          // }

          static async user(req, res) {
                    res.send({
                              message: "Your Code Run Complate"
                    })
          }

}