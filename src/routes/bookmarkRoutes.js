const router = require("express").Router();
const {
  bookmarkPost,
  getUserAllBookmark,
  getBookmark,
  deleteBookmark,
} = require("../controller/bookmarkController");
const {
  validateBookmarkPost,
  validateGetBookmarkPost,
  validateDeleteBookmarkPost,
} = require("../middleware/validation");
const passport = require("passport"); //Authentication Middleware
require("../middleware/passport");

//For Bookmark Post Route
router.post(
  "/bookmarkPost",
  passport.authenticate("jwt", { session: false }),
  validateBookmarkPost,
  bookmarkPost
);

//For Get User All Bookmark Route
router.get(
  "/getUserAllBookmark",
  passport.authenticate("jwt", { session: false }),
  getUserAllBookmark
);

//For Get User Specific Bookmark Route
router.get(
  "/getBookmark",
  passport.authenticate("jwt", { session: false }),
  validateGetBookmarkPost,
  getBookmark
);

//For delete Spcific Bookmark Route
router.delete(
  "/deleteBookmark",
  passport.authenticate("jwt", { session: false }),
  validateDeleteBookmarkPost,
  deleteBookmark
);

module.exports = router;
