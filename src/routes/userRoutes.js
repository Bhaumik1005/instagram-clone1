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

// validateUserData,validateUserData.validateUser,
router.post("/signup", multer1, validateRegisterUser, signup);

//For Validate User E-mail
router.post("/verifyuseremail/:priEmailToken", verifyUserEmail);

//For Login User With Email And Password
router.post("/login", validateUserLogin, userLogin);

//For Display User Profile
router.get(
  "/getProfile",
  passport.authenticate("jwt", { session: false }),
  userProfile
);

//For Update User ProfilePic
router.put("/updateProfilePicture", multer1, updateProfilePicture);

//For Update User Profile Data
router.put(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  validateUpdatedData,
  updateUserProfile
);

//For Forgot the password
router.post("/forgotPassword", validateForgotPassword, forgotPassword);

//For REset password Template
router.get("/resetTemplate/:forgotPasswordToken", resetTemp);

//For Reset User Password
router.post(
  "/resetPassword/:forgotPasswordToken",
  validateResetPassword,
  resetPassword
);

module.exports = router;
