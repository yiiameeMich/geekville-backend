const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductImageSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: () => 'Product Name',
  },
  description: {
    type: String,
    required: true,
    default: () => 'No description given',
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: () => 1,
  },
}, {
  timestamps: true,
})

const ProductImage = mongoose.model('productImages', ProductImageSchema)

module.exports = ProductImage