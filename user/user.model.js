const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: () => false,
  },
  role: {
    type: String,
    default: () => 'User',
  },
  avatar: {
    type: String,
    required: false,
    default: () => ''
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bonusesAmount: {
    type: Number,
    required: false,
    default: () => 0,
  },
  verificationToken: {
    type: String,
    required: false,
    default: () => '',
  },
}, {
  timestamps: true,
})

const User = mongoose.model('users', UserSchema)

module.exports = User