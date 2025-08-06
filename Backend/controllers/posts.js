const UserPost = require("../models/UserPost");

// Create a post
exports.createPost = async (req, res) => {
  try {
    const post = new UserPost({ ...req.body, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await UserPost.find().populate("author", "name email");
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};