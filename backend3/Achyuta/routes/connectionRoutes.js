const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// Get all conversations for user
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate({
      path: 'participants',
      select: 'name avatar',
      match: { _id: { $ne: req.user.id } }
    })
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or get existing conversation
router.post('/', protect, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId], $size: 2 }
    })
    .populate('participants', 'name avatar')
    .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [req.user.id, participantId]
      });
      
      await conversation.save();
      
      // Populate the new conversation
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name avatar');
    }

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;