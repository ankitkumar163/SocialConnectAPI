const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: String,
});

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  postID: {
    type: String,
    unique: true,
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },

  likes: {
    type: Number,
    default: 0,
  },
  comments: [CommentSchema],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
