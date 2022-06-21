const router = require("express").Router();
const {
  validateRegisterUser,
  validateUserLogin,
  validateUpdatedData,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validation");
const { multer1 } = require("../middleware/uploadProfile");
const {
  signup,
  verifyUserEmail,
  userLogin,
  userProfile,
  updateProfilePicture,
  updateUserProfile,
  forgotPassword,
  resetTemp,
  resetPassword,
} = require("../controller/userController");
const passport = require("passport"); //Authentication Middleware
const multer = require("multer");
const upload = multer();
require("../middleware/passport");

//Signup Route
router.post("/signup", multer1, validateRegisterUser, signup);

//Validate User E-mail Route
router.post("/verifyuseremail/:emailToken", verifyUserEmail);

//Login Route
router.post("/login", validateUserLogin, userLogin);

//Display User Profile Route
router.get(
  "/getProfile",
  passport.authenticate("jwt", { session: false }),
  userProfile
);

//Update User ProfilePicture Route
router.put(
  "/updateProfilePicture",
  passport.authenticate("jwt", { session: false }),
  multer1,
  updateProfilePicture
);

//Update User Profile Data Route
router.put(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  validateUpdatedData,
  updateUserProfile
);

//Forgot password Route
router.post("/forgotPassword", validateForgotPassword, forgotPassword);

//Reset password Template Route
router.get("/resetTemplate/:forgotPasswordToken", resetTemp);

//Reset User Password Route
router.post(
  "/resetPassword/:forgotPasswordToken",
  validateResetPassword,
  resetPassword
);

module.exports = router;
