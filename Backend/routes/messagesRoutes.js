const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const protect = require('../middleware/authMiddleware');

// Get messages for a conversation
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversation: req.params.conversationId 
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar');
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a new message
router.post('/', protect, async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    
    // Create new message
    const newMessage = new Message({
      conversation: conversationId,
      sender: req.user.id,
      content
    });

    // Save the message
    const savedMessage = await newMessage.save();
    
    // Populate sender info
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name avatar');

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id,
      updatedAt: Date.now()
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/:conversationId/read', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { 
        conversation: req.params.conversationId,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      { 
        $addToSet: { readBy: req.user.id },
        $set: { read: true }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;