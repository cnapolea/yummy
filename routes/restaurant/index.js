// jshint esversion:10

require('dotenv').config();
const Restaurant = require('../../models/restaurant');
const { Router } = require('express');
const router = Router();
const upload = require('../../middleware/file-upload');
const axios = require('axios');

// Function that formats GEOCODING URL
const GEOCODING_URL = require('./getLngLat');

// import middlewares
const routeGuard = require('../../middleware/route-guard');

// GET request to display restaurants (divided into sections)
router.get('/', (req, res, next) => {
  Restaurant.find()
    .limit(10)
    .sort({ rating: -1 })
    .then((restaurants) => {
      console.log(restaurants);
      res.render('restaurant/restaurants', { restaurants });
    })
    .catch((error) => next(error));
});

router.post('/', (req, res, next) => {
  const { searchedText, city, rating, price } = req.body;

  Restaurant.find({ city, rating, price, $text: { $search: searchedText } })
    .then((restaurants) => {
      res.render('restaurants', { restaurants });
    })
    .catch((error) => next(error));
});

// GET request to take to the create form view
router.get('/create', routeGuard, (req, res, next) => {
  res.render('restaurant/create-restaurant');
});

// POST request to create a restaurant document in the DB
router.post('/create', routeGuard, upload.single('image'), (req, res, next) => {
  const { name, address1, postalCode, city, country, cousine, price, rating } =
    req.body;
  let image;
  console.log(req.file);
  if (req.file) {
    image = req.file.path;
  }

  axios
    .get(GEOCODING_URL(req.body))
    .then((address) => {
      const { lat, lng } = address.data.results[0].geometry.location;
      return Restaurant.create({
        name,
        image,
        position: {
          coordinates: [lng, lat]
        },
        cousine,
        price,
        creator: req.user._id,
        rating
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

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findById(id)
    .then((restaurant) => {
      res.render('restaurant', { restaurant });
    })
    .catch((error) => next(error));
});

module.exports = router;
