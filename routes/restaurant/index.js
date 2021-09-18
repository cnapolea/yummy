require('dotenv').config();
const Restaurant = require('../../models/restaurant');
const { Router } = require('express');
const router = Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const axios = require('axios');

// Function that formats GEOCODING URL
const GEOCODING_URL = require('./getLngLat');

// GET request to take to the create form view
router.get('/create', (req, res, next) => {
  res.render('restaurant/create-restaurant');
});

// POST request to create a restaurant document in the DB
router.post('/create', (req, res, next) => {
  const { name, address1, postalCode, city, country, cousine, price, image } =
    req.body;

  axios
    .get(GEOCODING_URL(req.body))
    .then((address) => {
      // console.log(address.data.results[0]);
      const { lat, lng } = address.data.results[0].geometry.location;
      return Restaurant.create({
        name,
        image,
        position: {
          coordinates: [lng, lat]
        },
        cousine,
        price,
        creator: req.user._id
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

module.exports = router;
