const mongoose = require("mongoose");

//Create Post Schema
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postName: {
      type: Array,
      required: true,
    },
    location: {
      type: String,
    },
    caption: {
      type: String,
    },
    likes: {
      type: Array,
      userId: { type: mongoose.Schema.Types.ObjectId },
      userName: { type: String }
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
