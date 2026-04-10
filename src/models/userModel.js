const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true, 
    lowercase: true,
  },

  password: {
    type: String, 
  },

  role: {
    type: String,
    enum: ['user', 'guest'],
    default: 'user'
  },

  expiresAt: {
    type: Date,
    expires: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);