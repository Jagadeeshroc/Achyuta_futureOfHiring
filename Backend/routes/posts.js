// Backend Routes: routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, getPosts, likePost, addComment, applyToPost, getFollowingPosts, getDiscoverPosts, getPostById } = require('../controllers/posts');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

router.post('/', auth, upload.single('image'), createPost);
router.get('/', auth, getPosts);
router.post('/:postId/like', auth, likePost);
router.post('/:postId/comment', auth, addComment);
router.post('/applications', auth, applyToPost);
router.get('/following', auth, getFollowingPosts);
router.get('/discover', auth, getDiscoverPosts);
router.get('/:id', auth, getPostById);

module.exports = router;