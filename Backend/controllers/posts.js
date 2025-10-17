// Backend: controllers/posts.js (Remove getUserFollowing - add mongoose import, fix populate)
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose'); // Add this

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = new Post({
      user: userId,
      content,
      image
    });

    await post.save();
    await post.populate('user', 'first_name last_name avatar title');

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ error: 'Server error while creating post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'first_name last_name avatar title')
      .populate('likes', 'first_name')
      .populate('comments.user', 'first_name last_name avatar') // Add if subdocs
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userLikedIndex = post.likes.indexOf(userId);
    if (userLikedIndex > -1) {
      post.likes.splice(userLikedIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('user', 'first_name last_name avatar title');
    await post.populate('likes', 'first_name last_name avatar');

    res.json(post);
  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ error: 'Server error while liking post' });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      content: comment
    });

    await post.save();
    await post.populate('user', 'first_name last_name avatar title');
    await post.populate('comments.user', 'first_name last_name avatar');

    res.json(post);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ error: 'Server error while adding comment' });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId).select('following');
    
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const followingIds = currentUser.following.map(f => f._id);
    
    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'first_name last_name avatar title')
      .populate('likes', 'first_name last_name avatar')
      .populate('comments.user', 'first_name last_name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(posts);
  } catch (err) {
    console.error('Error fetching following posts:', err.message);
    res.status(500).json({ error: 'Server error while fetching following posts' });
  }
};

const getDiscoverPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'first_name last_name avatar title')
      .populate('likes', 'first_name last_name avatar')
      .populate('comments.user', 'first_name last_name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching discover posts:', err.message);
    res.status(500).json({ error: 'Server error while fetching discover posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(id)
      .populate('user', 'first_name last_name avatar title')
      .populate('likes', 'first_name last_name avatar')
      .populate('comments.user', 'first_name last_name avatar');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err.message);
    res.status(500).json({ error: 'Server error while fetching post' });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
  getFollowingPosts,
  getDiscoverPosts,
  getPostById
};