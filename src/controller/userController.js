// const express = require("express");
const userModel = require("../model/userModel");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const mongoObjectId = require("mongodb");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//For User SignUp Page
exports.signup = async (req, res) => {
    try {
        const img = fs.readFileSync(req.file.path);
        // console.log("img--------",img);
        const encode_img = img.toString("base64");
        // console.log("encode--------",encode_img);
        const final_img = {
            contentType: req.file.mimetype,
            image: new Buffer.from(encode_img, "base64"),
        };

        if (final_img) {
            const user = new userModel(req.body);
            // console.log("User-------", user);
            const name = user.name;
            const RegisterEmail = user.email;

            const CheckEmail = await userModel.findOne({ email: req.body.email });

            if (CheckEmail) {

                res.status(500).send({
                    message: "Email already Registered",
                });

            } else {
                const priEmailToken = randomString(
                    32,
                    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                );
                function randomString(length, chars) {
                    let result = "";
                    for (let i = length; i > 0; --i)
                        result += chars[Math.floor(Math.random() * chars.length)];

                    return result;
                }

                user.priEmailToken = priEmailToken;
                user.profilePic = req.file.filename;
                // generate salt to hash password
                const salt = await bcrypt.genSalt(10);
                // now we set user password to hashed password
                password = await bcrypt.hash(user.password, salt);
                user.password = password;

                await user.save();
                // console.log("Updated User-------", user);

                //Email Functionality
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "bhaumikjoshi1052@gmail.com",
                        pass: "ytfzekwoyuatxbzb",
                    },
                });

                //For Add HTML Template
                const data = await ejs.renderFile(
                    path.join(__dirname, "../view/pages/validation.ejs"),
                    { priEmailToken, name }
                );
                // console.log("data.....", data);

                const mailOptions = {
                    from: "bhaumikjoshi1052@gmail.com",
                    to: RegisterEmail,
                    subject: "Validate User",
                    text: "Please Verify Your E-mail Id",
                    html: data,
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log("ERRRRRR>>>>>>>>.", err);
                        return;
                    }
                    console.log("sent ", info.response);
                });

                console.log("Email Function Successfuly");

                return res.status(201).send({
                    message: "Succesfully Add User Data Please Verify your E-mail",
                });
            }
        } else {
            res.status(500).send({
                message: "Please Upload Your Profile Picture"
            })
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error);
    }
};

//  For Validate the user
exports.VerifyUserEmail = async (req, res) => {
    try {
        // console.log("-------", req.params.priEmailToken);
        const EmailToken = await userModel.findOne({
            priEmailToken: req.params.priEmailToken,
        });

        // console.log("EmailToken---------", EmailToken);
        if (req.params.priEmailToken === EmailToken.priEmailToken) {

            const updatetoken = await userModel.findOneAndUpdate(
                { _id: EmailToken._id }, {
                $set: { isEmailValide: true }, $unset: { priEmailToken: "" }
            }
            );

            res.status(201).send({
                message: "Succesfully Verified your E-mail. Login With Your Email and Password"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

//For Login the User
exports.userLogin = async (req, res) => {
    try {
        const user1 = await userModel.findOne({
            email: req.body.email,
        });

        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(
            req.body.password,
            user1.password
        );
        if (user1 && validPassword && user1.isEmailValide) {


            let payload = { id: user1._id };

            let token = jwt.sign(payload, process.env.JWTSECRATE, {
                expiresIn: "1h",
            });

            res.status(201).send({
                message: "Login Successfully",
                Token: token,
            });

        } else {
            res.status(401).send({
                message: "Invalid Credentials or Verify Your E-mail",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "Invalid Credentials",
        });
    }
};

//For Display User Profile
exports.userProfile = async (req, res) => {
    try {
        // console.log("User ID", req.user);
        let user = req.user;
        user.profilePic = "http://192.168.20.20:3000/uploadUserProfile/" + user.profilePic;
        // console.log(user.profilePic);

        res.status(201).send({
            message: "User Data",
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.send({
            message: "Unauthorized User",
            error: error.message,
        });
    }
};

//For Update User ProfilePicture
exports.updateUserProfilePic = async (req, res) => {
    try {
        // Fetch the user by id
        const user = req.body.email
        console.log(user);

        const img = fs.readFileSync(req.file.path);
        console.log("img--------", img);
        const encode_img = img.toString("base64");
        // console.log("encode--------",encode_img);
        const final_img = {
            contentType: req.file.mimetype,
            image: new Buffer.from(encode_img, "base64"),
        };
        console.log("finalimg--------", final_img);

        if (final_img) {
            res.status(201).send({
                message: "Profile Updated Successfully",
            });
        } else {
            res.status(401).send({
                message: "Profile not Updated",
                error: error.message
            });
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            error: error.message,
        });
    }
};

//For Update User Profile Data
exports.updateUserProfile = async function updateUserProfile(req, res) {
    try {

        const user = req.user;
        console.log("user====", user);
        if (user) {
            let updateProfile = await userModel.updateOne({ _id: user._id }, { $set: { name: req.body.name, age: req.body.age, phoneNumber: req.body.phoneNumber } })

            let UpdatedProfile = await userModel.findOne({ _id: user._id }, { name: true, age: true, phoneNumber: true})
            console.log(updateProfile);
            res.send(
                {
                    message: "Profile Update Successfully",
                    data: UpdatedProfile
                }
            );
        } else {
            res.status(401).send({
                message: "User does not exist",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            error: error.message,
        });
    }
};
