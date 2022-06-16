const mongoose = require("mongoose");

//Create Comment Schema
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comments: {
      type: Array,
      commentId: { type: String },
      message: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String },
      // commentReplay: {
      //   type: Array,
      //   replyId: { type: mongoose.Schema.Types.ObjectId },
      //   replyMessage: { type: String },
      //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      //   userName: { type: String },
      // },
    },
    commentReply: {
      type: Array,
      commentId: { type: String },
      replyId: { type: String },
      replyMessage: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
