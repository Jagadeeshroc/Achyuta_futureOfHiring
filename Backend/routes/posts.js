// Backend: routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming auth middleware
const multer = require('multer'); // For file uploads
const { createPost, getPosts, likePost, addComment, getDiscoverPosts, getFollowingPosts,getPostById  } = require('../controllers/posts');

// Multer setup for image upload (basic local storage; use Cloudinary for production)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Create 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/', auth, upload.single('image'), createPost);
router.get('/', auth, getPosts);
router.get('/following', auth, getFollowingPosts);
router.get('/discover', auth, getDiscoverPosts);
router.get('/:id', auth, getPostById);
router.post('/:postId/like', auth, likePost);
router.post('/:postId/comment', auth, addComment);


module.exports = router;