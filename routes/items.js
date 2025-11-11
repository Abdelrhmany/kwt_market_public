const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { itemValidation, validate } = require('../middleware/validation');
const upload = require('../upload');

// GET: Get all items (public, optional auth for personalized results)
router.get('/', optionalAuth, itemController.getAllItems);

// GET: Get single item by ID (public)
router.get('/:id', itemController.getItemById);

// POST: Create new item (requires authentication)
router.post(
  '/',
  authenticate,
  upload.array('images', 5),
  itemValidation,
  validate,
  itemController.createItem
);

// PUT: Update item (requires authentication and ownership)
router.put(
  '/:id',
  authenticate,
  upload.array('images', 5),
  itemValidation,
  validate,
  itemController.updateItem
);

// DELETE: Delete item (requires authentication and ownership)
router.delete('/:id', authenticate, itemController.deleteItem);

module.exports = router;
