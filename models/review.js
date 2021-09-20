'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'restaurant',
      required: true
    },
    content: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 300
    },
    likes: {
      type: Number,
      default: 0,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at' }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
