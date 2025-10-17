const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController');
const auth = require('../middleware/auth');

router.get('/:jobId/reviews', reviewController.getReviews);
router.post('/:jobId/reviews', auth, reviewController.createReview);

module.exports = router;