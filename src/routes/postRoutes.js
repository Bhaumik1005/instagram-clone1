const router = require("express").Router();
const {
  uploadPost,
  getUserAllPost,
  editUserPost,
  deleteUserPost,
  getAllPost,
  likePost,
} = require("../controller/postController");
const { uploadPostMulter } = require("../middleware/uploadPost");
const multer = require("multer");
const passport = require("passport"); //Authentication Middleware
const upload = multer();
require("../middleware/passport");

//Post the Photo on instagram
router.post(
  "/uploadPost",
  passport.authenticate("jwt", { session: false }),
  uploadPostMulter,
  uploadPost
);

//Get All Post From Specific User
router.get(
  "/getAllPost",
  passport.authenticate("jwt", { session: false }),
  getUserAllPost
);

//Edit User Specific Post
router.put(
  "/editUserPost",
  passport.authenticate("jwt", { session: false }),
  editUserPost
);

//Delete User Specific post
router.delete(
  "/deleteUserPost",
  passport.authenticate("jwt", { session: false }),
  deleteUserPost
);

//Get All DB Posts
router.get(
  "/getAllPost",
  passport.authenticate("jwt", { session: false }),
  getAllPost
);

//Like Posts
router.put(
  "/likePost",
  passport.authenticate("jwt", { session: false }),
  likePost
);

module.exports = router;
