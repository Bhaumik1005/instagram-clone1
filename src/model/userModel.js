const mongoose = require("mongoose");

//Create User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      //   select: false
    },
    age: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    emailToken: {
      type: String,
    },
    isEmailValide: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    forgotPasswordToken: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("UserProfile", UserSchema);

module.exports = User;
