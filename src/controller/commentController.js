const { find, findOneAndUpdate } = require("../model/commentModel");
const commentModel = require("../model/commentModel");

//For Add Comment
exports.comment = async (req, res) => {
  try {
    var postId = req.body.postId;
    var message = req.body.message;

    const commentId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    let checkPost = await commentModel.findOne({ postId: req.body.postId });

    if (checkPost) {
      const addNewComment = await commentModel.findOneAndUpdate(
        {
          postId: req.body.postId,
        },
        {
          $push: {
            comments: {
              commentId: commentId,
              message: req.body.message,
              userId: req.user._id,
              userName: req.user.name,
            },
          },
        }
      );

      res.send({
        message: "Your Comment Added",
      });
    } else {
      var comments = {
        commentId: commentId,
        message: req.body.message,
        userId: req.user._id,
        userName: req.user.name,
      };

      let newComment = {};
      newComment.postId = req.body.postId;
      newComment.comments = comments;
      newComment.commentReply = [];

      await commentModel.create(newComment);

      res.send({
        message: "Your Comment Added",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

//For Get All comment For SPecificPost
exports.getallComment = async (req, res) => {
  try {
    const getallComment = await commentModel.findOne({
      postId: req.body.postId,
    });
    console.log(getallComment);

    res.send({
      data: getallComment.comments,
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

//For Edit the Specific Comment
exports.editComment = async (req, res) => {
  try {
    const editComment = await commentModel.findOneAndUpdate(
      {
        postId: req.body.postId,
        comments: {
          $elemMatch: {
            commentId: req.body.commentId,
          },
        },
      },
      { $set: { "comments.$.message": req.body.message } },
      { new: true }
    );

    res.send({
      message: "Your Comment Updated",
      data: editComment,
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

//For Delete The Specific Comment
exports.deleteComment = async (req, res) => {
  try {
    const deleteComment = await commentModel.updateOne(
      {},
      {
        $pull: {
          comments: {
            commentId: req.body.commentId,
            userId: req.user._id,
          },
        },
      }
    );

    res.send({
      message: "Your Comment Delete",
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

//For Add Replay In comment
exports.commentReply = async (req, res) => {
  try {
    const replyId = Math.random().toString(36).substring(2, 15);

    let checkPost = await commentModel.findOne({
      postId: req.body.postId,
      comments: {
        $elemMatch: {
          commentId: req.body.commentId,
        },
      },
    });

    if (checkPost) {
      var replyQuery = {};
      replyQuery.commentId = req.body.commentId;
      replyQuery.replyId = replyId;
      replyQuery.replyMessage = req.body.message;
      replyQuery.userId = req.user._id;
      replyQuery.userName = req.user.name;

      var updateQuery = {};
      updateQuery.commentReply = replyQuery;

      var getComment = await commentModel.findOneAndUpdate(
        {
          "comments.commentId": req.body.commentId,
        },
        { $set: updateQuery },
        { new: true, upsert: true }
      );

      res.send({
        message: "Your Comment Reply Added",
        data: getComment,
      });
    } else {
      res.send({
        message: "Can't Find This Post Or Comment",
      });
    }
  } catch (err) {
    res.send({
      Error: err.message,
    });
  }
};

//For Edit Specific Reply
exports.editCommentReply = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const replyId = req.body.replyId;
    const editCommentReply = await commentModel.findOneAndUpdate(
      {
        postId: req.body.postId,

        commentReply: {
          $elemMatch: {
            commentId: commentId,
            replyId: replyId,
            userId: req.user._id,
          },
        },
      },
      { $set: { "commentReply.$.replyMessage": req.body.replyMessage } },
      { new: true }
    );

    res.send({
      message: "Your Comment Reply Updated",
      data: editCommentReply,
    });
  } catch (error) {
    res.send({
      Error: error,
    });
  }
};

//For Delete Specific Reply
exports.deleteCommentReply = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const replyId = req.body.replyId;
    const CommentReply = await commentModel.findOne({
      postId: req.body.postId,
      commentReply: {
        $elemMatch: {
          commentId: commentId,
          replyId: replyId,
          userId: req.user._id,
        },
      },
    });

    if (CommentReply) {
      const deleteComment = await commentModel.updateOne(
        {},
        {
          $pull: {
            commentReply: {
              commentId: req.body.commentId,
              replyId: req.body.replyId,
              userId: req.user._id,
            },
          },
        }
      );

      res.send({
        message: "Your Comment Reply Delete",
      });
    } else {
      res.send({
        message: "Can't Find Your Reply",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};
