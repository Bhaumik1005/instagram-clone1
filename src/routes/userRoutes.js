const router = require("express").Router();
const {validateUser,validateUserLogin, validateUpdatedData} = require("../middleware/validation");
const {multer1} = require("../middleware/uploadProfile");
const {signup, VerifyUserEmail, userLogin, userProfile,updateUserProfilePic, updateUserProfile} = require("../controller/userController")
const passport = require("passport"); //Authentication Middleware
const multer = require('multer')
const upload = multer();
require('../middleware/passport');

// const jwt = require('jsonwebtoken'); //For JSON Webtoken
// validateUserData,validateUserData.validateUser,
router.post("/signup",multer1,validateUser, signup);

//For Validate User E-mail
router.post("/verifyuseremail/:priEmailToken", VerifyUserEmail);

//For Login User With Email And Password
// login
router.post("/", upload.none(),validateUserLogin,userLogin)

//For Display User Profile
// getProfile
router.get("/",passport.authenticate('jwt', {session: false}),  userProfile)

//For Update User ProfilePic
// updateProfilePic ,passport.authenticate('jwt', {session: false}),
router.put("/",multer1, updateUserProfilePic)
 

//For Update User Profile Data
router.put("/updateProfile",passport.authenticate('jwt', {session: false}),upload.none(),validateUpdatedData,updateUserProfile)



module.exports = router;