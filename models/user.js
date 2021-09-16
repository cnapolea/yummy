'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  passwordHashAndSalt: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },

  level: {
    type: Number,
    required: true,
    default: 0
  },

  profilePicture: {
    type: String,
    required: true,
    default:
      'https://res.cloudinary.com/dnsqwd8bw/image/upload/v1631811444/heather-ford-6f6G4U6Y6Vs-unsplash_zwiplg.jpg'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
