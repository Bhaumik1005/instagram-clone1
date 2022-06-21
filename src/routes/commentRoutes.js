const router = require("express").Router();
const {
  comment,
  getallComment,
  editComment,
  deleteComment,
  commentReply,
  editCommentReply,
  deleteCommentReply,
} = require("../controller/commentController");
const {
  validateComment,
  validateGetAllComment,
  validateDeleteComment,
  validateEditComment,
  validateCommentReply,
  validateEditCommentReply,
  validateDeleteCommentReply,
} = require("../middleware/validation");
const passport = require("passport"); //Authentication Middleware
require("../middleware/passport");

//Add Comment Route
router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  validateComment,
  comment
);

//Get All comment For SPecificPost Route
router.get(
  "/getAllComment",
  passport.authenticate("jwt", { session: false }),
  validateGetAllComment,
  getallComment
);

//Edit the Specific Comment Route
router.put(
  "/editComment",
  passport.authenticate("jwt", { session: false }),
  validateEditComment,
  editComment
);

//Delete The Specific Comment Route
router.put(
  "/deleteComment",
  passport.authenticate("jwt", { session: false }),
  validateDeleteComment,
  deleteComment
);

//Add Replay In comment Route
router.post(
  "/commentReply",
  passport.authenticate("jwt", { session: false }),
  validateCommentReply,
  commentReply
);

//Edit Specific Comment Reply Route
router.put(
  "/editCommentReply",
  passport.authenticate("jwt", { session: false }),
  validateEditCommentReply,
  editCommentReply
);

//Delete Specific Reply Route
router.put(
  "/deleteCommentReply",
  passport.authenticate("jwt", { session: false }),
  validateDeleteCommentReply,
  deleteCommentReply
);

module.exports = router;
