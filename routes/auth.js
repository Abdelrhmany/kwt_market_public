const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  verifyValidation,
  resetPasswordValidation,
  updatePasswordValidation,
  validate,
} = require('../middleware/validation');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

// Register
router.post('/register', authLimiter, registerValidation, validate, authController.register);

// Verify
router.post('/verify', authLimiter, verifyValidation, validate, authController.verify);

// Login
router.post('/login', authLimiter, loginValidation, validate, authController.login);

// Reset Password (Send Code)
router.post('/reset-password', passwordResetLimiter, resetPasswordValidation, validate, authController.resetPassword);

// Update Password
router.post('/update-password', passwordResetLimiter, updatePasswordValidation, validate, authController.updatePassword);

module.exports = router;

