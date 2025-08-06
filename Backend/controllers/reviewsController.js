const Review = require('../models/Reviews');
const mongoose = require('mongoose');


exports.getReviews = async (req, res) => {
  try {
    const jobId = new mongoose.Types.ObjectId(req.params.jobId); 

    const reviews = await Review.find({ job: jobId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = new Review({
      content: req.body.content,
      job: req.params.jobId,
      user: req.user._id
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};