const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    validate: {
      validator: function (value) {
        // Check that title doesn't exceed 4 words
        return value.split(' ').filter(word => word.length > 0).length <= 4;
      },
      message: 'Title cannot exceed 4 words.'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  condition: {
    type: String,
    enum: {
      values: ['new', 'used'],
      message: 'Condition must be either "new" or "used"'
    },
    required: [true, 'Condition is required']
  },
  images: [{
    type: String
  }],
  datePosted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'sold'],
      message: 'Status must be either "active" or "sold"'
    },
    default: 'active'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Cars',
        'Property',
        'Services',
        'Furniture',
        'Camping',
        'Gifts',
        'Contracting',
        'Family',
        'Animals',
        'Electronics',
        'clo'
      ],
      message: 'Invalid category'
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  sellerid: {
    type: String,
    required: [true, 'Seller ID is required']
  },
  sellername: {
    type: String,
    required: [true, 'Seller name is required'],
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ datePosted: -1 });
itemSchema.index({ sellerid: 1 });

module.exports = mongoose.model('newitemCollection', itemSchema);
