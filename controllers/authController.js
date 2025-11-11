const User = require('../models/user');
const { sendMessage, isClientReady } = require('../config/whatsapp');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this phone number already exists',
      });
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken',
      });
    }

    // Check if WhatsApp client is ready
    if (!isClientReady()) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp client is not ready yet. Please try again later.',
      });
    }

    // Create new user
    const user = new User({
      phoneNumber,
      password,
      username,
    });

    // Generate verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Send verification code via WhatsApp
    try {
      await sendMessage(
        phoneNumber,
        `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
      );

      res.status(201).json({
        success: true,
        message: 'Verification code has been sent successfully',
      });
    } catch (whatsappError) {
      console.error('WhatsApp error:', whatsappError);
      // Delete user if WhatsApp send fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification code. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Verify user
exports.verify = async (req, res, next) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        error: 'User is already verified',
      });
    }

    if (!user.verifyCode(verificationCode)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired verification code',
      });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'User verified successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone number or password',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone number or password',
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        success: false,
        error: 'User not verified. Please verify your account first.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password (Send Verification Code)
exports.resetPassword = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!isClientReady()) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp client is not ready yet. Please try again later.',
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    try {
      await sendMessage(
        phoneNumber,
        `Your password reset code is: ${verificationCode}\nThis code will expire in 10 minutes.`
      );

      res.json({
        success: true,
        message: 'Verification code has been sent to your phone',
      });
    } catch (whatsappError) {
      console.error('WhatsApp error:', whatsappError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification code. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { phoneNumber, verificationCode, newPassword } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.verifyCode(verificationCode)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired verification code',
      });
    }

    user.password = newPassword;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

