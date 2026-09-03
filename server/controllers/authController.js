const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'saibaba_motors_super_secure_jwt_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // STRICT: Only allow rohanp0568@gmail.com
    if (cleanEmail !== 'rohanp0568@gmail.com') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    // STRICT: Only allow Rohan@0568
    if (cleanPassword !== 'Rohan@0568') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    let user = await User.findOne({ email: 'rohanp0568@gmail.com' });
    if (!user) {
      user = await User.create({
        name: 'Rohan Patil',
        email: 'rohanp0568@gmail.com',
        password: 'Rohan@0568',
        role: 'admin',
      });
    } else {
      let isMatch = false;
      try {
        isMatch = await user.matchPassword(cleanPassword);
      } catch (err) {
        isMatch = false;
      }
      if (!isMatch) {
        user.password = 'Rohan@0568';
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private (Admin)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
