const { body, validationResult } = require('express-validator');

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Register validation rules
exports.registerValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
];

// Login validation rules
exports.loginValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Verify validation rules
exports.verifyValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('verificationCode')
    .trim()
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
    .isNumeric().withMessage('Verification code must be numeric')
];

// Reset password validation
exports.resetPasswordValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
];

// Update password validation
exports.updatePasswordValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('verificationCode')
    .trim()
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
    .isNumeric().withMessage('Verification code must be numeric'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Item validation rules
exports.itemValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Cars', 'Property', 'Services', 'Furniture', 'Camping', 'Gifts', 'Contracting', 'Family', 'Animals', 'Electronics', 'clo'])
    .withMessage('Invalid category'),
  body('condition')
    .trim()
    .notEmpty().withMessage('Condition is required')
    .isIn(['new', 'used']).withMessage('Condition must be either "new" or "used"')
];

