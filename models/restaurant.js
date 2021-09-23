const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 120,
      minLength: 3
    },

    image: {
      type: String,
      default: 'https://source.unsplash.com/random'
    },

    position: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [
        {
          type: Number
        }
      ]
    },

    description: {
      type: String,
      maxLength: 150,
      default: 'No description available.',
      required: true
    },

    cousine: {
      type: String,
      required: true
    },

    menu: {
      type: [String]
    },

    price: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$', '$$$$$'],
      required: true
    },

    rate: {
      type: Number,
      max: 5,
      min: 1
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    likes: {
      type: Number,
      default: 0,
      required: true
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],

    rating: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at' }
  }
);

const Restaurant = mongoose.model('restaurant', restaurantSchema);

Restaurant.createIndexes({
  name: 'text',
  menu: 'text',
  cousine: 'text'
});

Restaurant.ensureIndexes({ position: '2dsphere' });

module.exports = Restaurant;
