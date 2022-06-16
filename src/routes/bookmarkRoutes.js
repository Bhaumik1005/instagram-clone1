const router = require("express").Router();
const {
  bookmarkPost,
  getUserAllBookmark,
  getBookmark,
  deleteBookmark,
} = require("../controller/bookmarkController");
const passport = require("passport"); //Authentication Middleware
require("../middleware/passport");

//For Bookmark Post
router.post(
  "/bookmarkPost",
  passport.authenticate("jwt", { session: false }),
  bookmarkPost
);

//For Get All Bookmark,
router.get(
  "/getUserAllBookmark",
  passport.authenticate("jwt", { session: false }),
  getUserAllBookmark
);

//For Get Spccific Bookmark
router.get(
  "/getBookmark",
  passport.authenticate("jwt", { session: false }),
  getBookmark
);

//For delete Spcific Bookmark
router.delete(
  "/deleteBookmark",
  passport.authenticate("jwt", { session: false }),
  deleteBookmark
);
module.exports = router;
