const router = require("express").Router();
const {
  comment,
  getallComment,
  editComment,
  deleteComment,
  commentReply,
  editCommentReply,
  deleteCommentReply
} = require("../controller/commentController");
const passport = require("passport"); //Authentication Middleware
require("../middleware/passport");

//For Add Comment
router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  comment
);

//For Get All comment For SPecificPost
router.get(
  "/getAllComment",
  passport.authenticate("jwt", { session: false }),
  getallComment
);

//For Edit the Specific Comment
router.put(
  "/editComment",
  passport.authenticate("jwt", { session: false }),
  editComment
);

//For Delete The Specific Comment
router.put(
  "/deleteComment",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

//For Add Replay In comment
router.post(
  "/commentReply",
  passport.authenticate("jwt", { session: false }),
  commentReply
);

//For Edit Specific Comment Reply
router.put(
  "/editCommentReply",
  passport.authenticate("jwt", { session: false }),
  editCommentReply
);


//For Delete Specific Reply
router.put("/deleteCommentReply",passport.authenticate("jwt", { session: false }),deleteCommentReply)

module.exports = router;
