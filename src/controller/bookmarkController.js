const bookmarkModel = require("../model/bookmarkModel");
const postModel = require("../model/postModel");
 
/*Bookmark Post Logic*/
exports.bookmarkPost = async (req, res) => {
  try {
    const existBookmark = await bookmarkModel.findOne({
      userId: req.user._id,
      bookmarkPostId: req.body.postId,
    });

    if (existBookmark) {
      res.send({
        message: "You Already Saved This Post",
      });
    } else {
      const addBookmark = new bookmarkModel();

      addBookmark.userId = req.user._id;
      addBookmark.bookmarkPostId = req.body.postId;
      await addBookmark.save();

      res.send({
        message: "Your Post Saved",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Get ALL Bookmark Logic */
exports.getUserAllBookmark = async (req, res) => {
  try {
    const userAllBookmark = await bookmarkModel.find({ userId: req.user._id });

    if (userAllBookmark) {
      const getPost = [];
      for (i = 0; i < userAllBookmark.length; i++) {
        const Post = await postModel.findOne(
          { _id: userAllBookmark[i].bookmarkPostId },
          { postName: true, location: true, caption: true, likes: true }
        );

        getPost.push(Post);
      }

      if (getPost) {
        const userData = [];

        //For Get User Post data
        for (i = 0; i < getPost.length; i++) {
          for (j = 0; j < getPost[i].postName.length; j++) {
            getPost[i].postName[j] =
              "http://Localhost:3000/userPost/" + getPost[i].postName[j];
          }
          userData.push(getPost[i]);
        }
        res.send({
          message: "User All Saved Post",
          data: userData,
        });
      } else {
        res.send({
          message: "Can't Find This post or Auther Delete This Post",
        });
      }
    } else {
      res.send({
        message: "You Don't have any Bookmark",
      });
    }
  } catch (error) {
    res.send({
      Error: error,
    });
  }
};

/*Get User Specific Bookmark Logic*/
exports.getBookmark = async (req, res) => {
  try {
    const userBookmark = await bookmarkModel.findOne({
      userId: req.user._id,
      bookmarkPostId: req.body.postId,
    });

    if (userBookmark) {
      const getPost = await postModel.findOne(
        { _id: userBookmark.bookmarkPostId },
        { postName: true, location: true, caption: true, likes: true }
      );

      if (getPost) {
        getPost.postName = "http://Localhost:3000/userPost/" + getPost.postName;

        res.send({
          message: "Get User Saved Specific Post",
          data: getPost,
        });
      } else {
        res.send({
          message: "Can't Find This post or Auther Delete This Post",
        });
      }
    } else {
      res.send({
        message: "Don't Find this Bookmark",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Delete User Specific Bookmark */
exports.deleteBookmark = async (req, res) => {
  try {
    const userBookmark = await bookmarkModel.findOne({
      userId: req.user._id,
      bookmarkPostId: req.body.postId,
    });

    if (userBookmark) {
      const deleteBookmark = await bookmarkModel.deleteOne({
        bookmarkPostId: req.body.postId,
      });
      res.send({
        message: "Your Bookmark Delete Succesfully",
      });
    } else {
      res.send({
        message: "Don't Find this Bookmark",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};
