const Item = require('../models/item');
const fs = require('fs');
const path = require('path');

// Helper function to convert images to Base64
const convertImagesToBase64 = async (imagePaths) => {
  const images = await Promise.all(
    imagePaths.map((imagePath) => {
      try {
        if (fs.existsSync(imagePath)) {
          const fileBuffer = fs.readFileSync(imagePath);
          const ext = path.extname(imagePath).substring(1);
          const base64Image = `data:image/${ext};base64,${fileBuffer.toString('base64')}`;
          return base64Image;
        }
        return null;
      } catch (error) {
        console.error(`Error reading image ${imagePath}:`, error);
        return null;
      }
    })
  );
  return images.filter((img) => img !== null);
};

// Create a new item
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, price, location, category, condition, subcategory } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const newItem = new Item({
      title,
      description,
      price,
      location,
      category,
      condition,
      subcategory,
      sellerid: req.user._id.toString(),
      sellername: req.user.username,
      images: imagePaths,
    });

    const savedItem = await newItem.save();
    res.status(201).json({
      success: true,
      data: savedItem,
    });
  } catch (error) {
    next(error);
  }
};

// Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const { category, condition, location, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (location) query.location = new RegExp(location, 'i');

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
      .sort({ datePosted: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Convert images to Base64
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const images = await convertImagesToBase64(item.images);
        return {
          ...item.toObject(),
          images,
        };
      })
    );

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: itemsWithImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    // Convert images to Base64
    const images = await convertImagesToBase64(item.images);

    res.json({
      success: true,
      data: {
        ...item.toObject(),
        images,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update item
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, category, condition, subcategory, status } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    // Check if user owns the item
    if (item.sellerid !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this item',
      });
    }

    // Update fields
    if (title) item.title = title;
    if (description) item.description = description;
    if (price) item.price = price;
    if (location) item.location = location;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (subcategory !== undefined) item.subcategory = subcategory;
    if (status) item.status = status;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      item.images.forEach((imagePath) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      // Add new images
      item.images = req.files.map((file) => file.path);
    }

    const updatedItem = await item.save();

    res.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    // Check if user owns the item
    if (item.sellerid !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this item',
      });
    }

    // Delete associated images
    item.images.forEach((imagePath) => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Item.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

