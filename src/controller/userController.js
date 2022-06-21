const userModel = require("../model/userModel"); //For Using User Model
const ejs = require("ejs"); //For Using HTML Template
const path = require("path"); //For used Specific Path
const mongoObjectId = require("mongodb");
const fs = require("fs"); //For Using File System
const bcrypt = require("bcrypt"); //For Create Hash password
const jwt = require("jsonwebtoken"); //For Using JSON web Token
const mailer = require("../services/nodemailer");
const Compression = require("../utils/imageCompression");
const logger = require("../utils/logger").logger;


/*User SignUp Page Logic*/
exports.signup = async (req, res) => {
  try {
    const finalImg = req.file;

    if (finalImg) {
      /* Image Compression Logic */
      const ImageLink = await Compression.imageCompression(finalImg);

      const user = new userModel(req.body);
      const name = user.name;

      /*Find User In DB*/
      const checkEmail = await userModel.findOne({ email: req.body.email });

      if (checkEmail) {
        res.status(500).send({
          message: "Email already Registered",
        });
      } else {
        /* Generate Email Token */
        const emailToken = Math.random().toString(6).substring(2);
        user.emailToken = emailToken;
        user.profilePic = ImageLink;

        /*Hash Password Generator */
        const salt = await bcrypt.genSalt(10); // generate salt to hash password
        password = await bcrypt.hash(user.password, salt); // now we set user password to hashed password
        user.password = password;
        await user.save();

        /*For Add HTML Template */
        const HTMlTEMP = await ejs.renderFile(
          path.join(__dirname, "../view/pages/validation.ejs"),
          { emailToken, name }
        );

        /*Add E-Mail Data */
        const data = {
          to: user.email,
          HTML: HTMlTEMP,
          subject: "Validate User E-mail",
        };

        /* Add E-mailFunctinality */
        mailer.mailer(data);

        return res.status(201).send({
          message: "Succesfully Add User Data Please Verify your E-mail",
        });
      }
    } else {
      res.status(500).send({
        message: "Please Upload Your Profile Picture",
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
    logger.error(`${res.status}- ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
};

/*User Email validation Logic*/
exports.verifyUserEmail = async (req, res) => {
  try {
    /*Find User Using Email Token */
    const findUser = await userModel.findOne({
      emailToken: req.params.emailToken,
    });

    if (findUser) {
      /*Update Email Validation And Delete Email Token*/
      const updateToken = await userModel.findOneAndUpdate(
        { _id: findUser._id },
        {
          $set: { isEmailValide: true },
          $unset: { emailToken: "" },
        }
      );

      if (updateToken) {
        res.status(201).send({
          message:
            "Succesfully Verified your E-mail. Login With Your Email and Password",
        });
      }
    } else {
      res.status(201).send({
        message: "Your Email Token Is Wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

/*Login User Logic*/
exports.userLogin = async (req, res) => {
  try {
    /* Find user In DB*/
    const user1 = await userModel.findOne({
      email: req.body.email,
    });

    /*check user password with hashed password stored in the database*/
    const validPassword = await bcrypt.compare(
      req.body.password,
      user1.password
    );

    /*Check User Credential for Login */
    if (user1 && validPassword && user1.isEmailValide) {
      let payload = { id: user1._id };

      let token = jwt.sign(payload, process.env.JWTSECRATE, {
        expiresIn: "24h",
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
    return res.status(401).send({
      error: error.message,
    });
  }
};

/*Display User Profile Logic*/
exports.userProfile = async (req, res) => {
  try {
    let user = req.user;

    res.status(201).send({
      message: "User Data",
      data: user,
    });
  } catch (error) {
    res.send({
      message: "Unauthorized User",
      error: error.message,
    });
  }
};

/*Update Profile Picture Logic */
exports.updateProfilePicture = async (req, res) => {
  try {
    const user = req.user;
    const finalImg = req.file;

    if (finalImg) {
      /* Image Compression Logic */
      const ImageLink = await Compression.imageCompression(finalImg);

      /*Update Profile Picture */
      let updateProfile = await userModel.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            profilePic: ImageLink,
          },
        },
        { new: true }
      );
      res.status(201).send({
        message: "Profile Updated Successfully",
        updateProfile,
      });
    } else {
      res.status(401).send({
        message: "Profile not Updated",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      error: error.message,
    });
  }
};

/*Update User Profile Data Logic */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      let updateProfile = await userModel.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            name: req.body.name,
            age: req.body.age,
            phoneNumber: req.body.phoneNumber,
          },
        },
        { new: true }
      );

      res.send({
        message: "Profile Update Successfully",
        data: {
          name: updateProfile.name,
          email: updateProfile.email,
          age: updateProfile.age,
          phoneNumber: updateProfile.phoneNumber,
        },
      });
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

/*Forgot Password Logic*/
exports.forgotPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (user) {
      /*Generate Forgot Password Token*/
      let forgotPasswordToken = Math.random().toString(13).substring(2);
      user.forgotPasswordToken = forgotPasswordToken;
      await user.save();

      /*ForgotPassword  HTML Template*/
      const HTMLTEMP = await ejs.renderFile(
        path.join(__dirname, "../view/pages/forgot.ejs"),
        { forgotPasswordToken }
      );

      /*User Mail Data */
      const data = {
        to: user.email,
        HTML: HTMLTEMP,
        subject: "Forgot Password",
      };

      /*Mail Function Call */
      mailer.mailer(data);

      res.send({
        message: "Reset password Link Send To Your E-mail",
      });
    } else {
      res.send({
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Render Reset Password Template */
exports.resetTemp = async (req, res) => {
  try {
    let forgotPasswordToken = req.params.forgotPasswordToken;

    /*render reset password Template */
    res.render(
      path.resolve(
        path.join(__dirname, "../../src/view/pages/resetTemplate.ejs")
      ),
      { forgotPasswordToken: forgotPasswordToken }
    );
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Reset Password Logic */
exports.resetPassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPass;
    const newPassword = req.body.newPass;
    const retypenewPassword = req.body.rnewPass;

    /*Forgot Password Token Check in DB*/
    let checkToken = await userModel.findOne({
      forgotPasswordToken: req.params.forgotPasswordToken,
    });

    if (checkToken) {
      /*Check Old and New Password are Diffrent*/
      const validPassword = await bcrypt.compare(
        newPassword,
        checkToken.password
      );

      if (validPassword) {
        res.send({ message: "Your Old And New Password are Same" });
      } else {
        if (newPassword === retypenewPassword) {
          /* generate salt to hash password*/
          const salt = await bcrypt.genSalt(10);

          /*now we set user password to hashed password*/
          setnewPassword = await bcrypt.hash(newPassword, salt);

    
          /* Update User Password*/
          const updatePass = await userModel.findByIdAndUpdate(
            { _id: checkToken._id },
            { $set: { password: setnewPassword } }
          );

          res.send({
            message: "Reset Password Successfully",
          });
        } else {
          res.send({
            message: "Conform Password & New Password are Not Same",
          });
        }
      }
    } else {
      res.send({ message: "Your Your Token Not Valide" });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};
