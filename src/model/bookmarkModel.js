const mongoose = require("mongoose");

//Create Bookmark Schema
const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarkPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    collectionName: {
      type: String,
      required: true,
      default: "Saved Post",
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
