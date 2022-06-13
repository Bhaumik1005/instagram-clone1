const userModel = require("../model/userModel"); //For Using User Model
const ejs = require("ejs"); //For Using HTML Template
const path = require("path"); //For used Specific Path
const mongoObjectId = require("mongodb");
const fs = require("fs"); //For Using File System
const bcrypt = require("bcrypt"); //For Create Hash password
const jwt = require("jsonwebtoken"); //For Using JSON web Token
const mailer = require("../services/nodemailer");

//For User SignUp Page
exports.signup = async (req, res) => {
  try {
    const img = fs.readFileSync(req.file.path);

    const encode_img = img.toString("base64");

    const finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer.from(encode_img, "base64"),
    };

    if (finalImg) {
      const user = new userModel(req.body);
      const name = user.name;

      const checkEmail = await userModel.findOne({ email: req.body.email });

      if (checkEmail) {
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

        //Hash Password Generator
        const salt = await bcrypt.genSalt(10); // generate salt to hash password
        password = await bcrypt.hash(user.password, salt); // now we set user password to hashed password
        user.password = password;
        await user.save();

        //For Add HTML Template
        const HTMlTEMP = await ejs.renderFile(
          path.join(__dirname, "../view/pages/validation.ejs"),
          { priEmailToken, name }
        );

        const data = {
          to: user.email,
          HTML: HTMlTEMP,
          subject: "Validate User E-mail",
        };

        //E-mailFunctinality
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
    console.log(error);
  }
};

// For Validate the user Email
exports.verifyUserEmail = async (req, res) => {
  try {
    const emailToken = await userModel.findOne({
      priEmailToken: req.params.priEmailToken,
    });

    if (req.params.priEmailToken === emailToken.priEmailToken) {
      const updateToken = await userModel.findOneAndUpdate(
        { _id: emailToken._id },
        {
          $set: { isEmailValide: true },
          $unset: { priEmailToken: "" },
        }
      );

      res.status(201).send({
        message:
          "Succesfully Verified your E-mail. Login With Your Email and Password",
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
    //Find user In DB
    const user1 = await userModel.findOne({
      email: req.body.email,
    });

    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(
      req.body.password,
      user1.password
    );

    //if Valide Credential user Login
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
    let user = req.user;
    user.profilePic =
      "http://192.168.20.20:3000/uploadUserProfile/" + user.profilePic;

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
exports.updateProfilePicture = async (req, res) => {
  try {
    // Fetch the user by id
    const user = req.body.email;

    //Multer Function
    const img = fs.readFileSync(req.file.path);
    const encodeImg = img.toString("base64");
    const finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer.from(encodeImg, "base64"),
    };

    if (finalImg) {
      res.status(201).send({
        message: "Profile Updated Successfully",
      });
    } else {
      res.status(401).send({
        message: "Profile not Updated",
        error: error.message,
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

//For Forgot passowrd
exports.forgotPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    let forgotPasswordToken = randomString(
      30,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    function randomString(length, chars) {
      let result = "";
      for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];

      return result;
    }
    user.forgotPasswordToken = forgotPasswordToken;
    await user.save();

    if (user) {
      //For Add HTML Template
      const HTMLTEMP = await ejs.renderFile(
        path.join(__dirname, "../view/pages/forgot.ejs"),
        { forgotPasswordToken }
      );

      const data = {
        to: user.email,
        HTML: HTMLTEMP,
        subject: "Forgot Password",
      };

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
    console.log("Error", error);
  }
};

//For Reset password Template
exports.resetTemp = async (req, res) => {
  let forgotPasswordToken = req.params.forgotPasswordToken;

  //TO render reset password Template
  res.render(
    path.resolve(
      path.join(__dirname, "../../src/view/pages/resetTemplate.ejs")
    ),
    { forgotPasswordToken: forgotPasswordToken }
  );
};

//For Reset Your Password Functionality
exports.resetPassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPass;
    const newPassword = req.body.newPass;
    const retypenewPassword = req.body.rnewPass;

    //Check Token in DB
    let checkToken = await userModel.findOne({
      forgotPasswordToken: req.params.forgotPasswordToken,
    });

    if (checkToken) {
      //Check new and old password Diffrent
      const validPassword = await bcrypt.compare(
        newPassword,
        checkToken.password
      );

      if (validPassword) {
        res.send({ message: "Your Old And New Password are Same" });
      } else {
        if (newPassword === retypenewPassword) {
          // generate salt to hash password
          const salt = await bcrypt.genSalt(10);
          // now we set user password to hashed password
          setnewPassword = await bcrypt.hash(newPassword, salt);

          //Update User Password
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
    res.send({ error: error });
  }
};
