const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Search users by name
router.get('/search', async (req, res) => {
  try {
    const name = req.query.name?.trim();
    if (!name) {
      return res.status(400).json({ error: 'Name query param is required' });
    }

    // 👇 MATCHES names that START with the search term
    const users = await User.find({
      name: { $regex: `^${name}`, $options: 'i' }
    })
    .select('-password')
    .limit(10)
    .sort({ name: 1 });

    res.json(users);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ GET user by ID - must come AFTER /search
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ CREATE a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, profilePic, skills } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const newUser = new User({ name, email, password, role, profilePic, skills });
    await newUser.save();

    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    res.status(201).json(userToReturn);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ UPDATE a user
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});
router.get('/recommended', async (req, res) => {
  try {
    const users = await User.find().limit(5);
    console.log('Fetched users:', users);
    res.json(users);
  } catch (err) {
    console.error('ERROR in /recommended:', err);
    res.status(500).send(err.message);
  }
});



module.exports = router;
