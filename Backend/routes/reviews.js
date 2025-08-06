const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:jobId/reviews', reviewController.getReviews);
router.post('/:jobId/reviews', authMiddleware, reviewController.createReview);

module.exports = router;