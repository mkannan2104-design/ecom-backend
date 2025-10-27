const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  images: {
    type: [String],
    default: ['https://via.placeholder.com/300x300?text=Product+Image']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Product+Image'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
