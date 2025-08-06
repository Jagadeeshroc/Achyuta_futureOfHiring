const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const protect = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const Message = require('../models/Message');

// ✅ Create or find conversation, always return populated participants
router.post('/', protect, async (req, res) => {
  const { participantId } = req.body;

  let conv = await Conversation.findOne({
    participants: { $all: [req.user.id, participantId] },
  });

  if (!conv) {
    conv = await Conversation.create({
      participants: [req.user.id, participantId],
    });
  }

  conv = await conv.populate('participants', 'name avatar');

  res.json(conv);
});

router.get('/unread-count', protect, async (req, res) => {
  const userId = req.user._id;
  const count = await Message.countDocuments({ 
    read: false, 
    'conversation.participants': userId, 
    sender: { $ne: userId } 
  });
  res.json({ count });
});

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    // Optionally validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    // Find messages for this conversation
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ✅ Get all conversations with participants & last message populated
router.get('/', protect, async (req, res) => {
  const convs = await Conversation.find({ participants: req.user.id })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  res.json(convs);
});



module.exports = router;
