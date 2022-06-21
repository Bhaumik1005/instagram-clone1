const router = require("express").Router();
const {
  uploadPost,
  getUserAllPost,
  editUserPost,
  deleteUserPost,
  getAllPost,
  likePost,
} = require("../controller/postController");
const {
 validateUploadPost,
 validateEditPost,
 validateDeletePost,
 validateLikePost
} = require("../middleware/validation");
const { uploadPostMulter } = require("../middleware/uploadPost");
const multer = require("multer");
const passport = require("passport"); //Authentication Middleware
const upload = multer();
require("../middleware/passport");

//Post the Photo on instagram Route
router.post(
  "/uploadPost",
  passport.authenticate("jwt", { session: false }),
  uploadPostMulter,
  validateUploadPost,
  uploadPost
);

//Get All Post From Specific User Route
router.get(
  "/getAllPost",
  passport.authenticate("jwt", { session: false }),
  getUserAllPost
);

//Edit User Specific Post Route
router.put(
  "/editUserPost",
  passport.authenticate("jwt", { session: false }),
  validateEditPost,
  editUserPost
);

//Delete User Specific post Route
router.delete(
  "/deleteUserPost",
  passport.authenticate("jwt", { session: false }),
  validateDeletePost,
  deleteUserPost
);

//Get All DB Posts Route
router.get(
  "/getAllPost",
  passport.authenticate("jwt", { session: false }),
  getAllPost
);

//Like Post Route
router.put(
  "/likePost",
  passport.authenticate("jwt", { session: false }),
  validateLikePost,
  likePost
);

module.exports = router;
