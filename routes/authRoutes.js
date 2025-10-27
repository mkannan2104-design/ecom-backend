const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  try {
    console.log('👤 Registration attempt:', req.body);
    const { name, email, password, address, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || 'user' // Allow specifying role during registration
    });

    console.log('✅ User created successfully:', user.email);
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt for:', email);
    console.log('📥 Provided password:', password);

    // Check for user
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? `Yes (${user.role})` : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('🔑 Stored hashed password:', user.password);
    const isMatch = await user.matchPassword(password);
    console.log('✅ Password match result:', isMatch);
    
    if (isMatch) {
      console.log('🎉 Login successful for:', user.email);
      
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          token: generateToken(user._id)
        }
      });
    } else {
      console.log('❌ Password comparison failed');
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;