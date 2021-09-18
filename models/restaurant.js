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
      type: mongoose.Types.ObjectId
    }
  },
  {
    timestamps: { createdAt: 'created_at' }
  }
);

const Restaurant = mongoose.model('restaurant', restaurantSchema);

Restaurant.createIndexes({
  name: 'text',
  menu: 'text'
});

module.exports = Restaurant;
