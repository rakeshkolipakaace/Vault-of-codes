const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) throw new Error('User not found');
    const match = await user.comparePassword(password);
    if(!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, id: user._id, username: user.username, role: user.role });
  } catch(err) {
    res.status(401).json({ error: err.message });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, email, skills, barterSkills } = req.body;
    
    // Check if username is already taken by another user
    if (username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }
    
    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken' });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, skills, barterSkills },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 