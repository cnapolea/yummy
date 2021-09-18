require('dotenv').config();
const Restaurant = require('../../models/restaurant');
const { Router } = require('express');
const router = Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const axios = require('axios');

// Function that formats GEOCODING URL
const GEOCODING_URL = require('./getLngLat');

// import middlewares
const routeGuard = require('../../middleware/route-guard');


router.get('/', (req, res, next) => {}
  Restaurant.find({limit: 10})
    .then((restaurants) => {
      res.render('restaurants', { restaurants });
    })
    .catch((error) => next(error));
);

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findById(id)
    .then((restaurant) => {
      res.render('restaurant', { restaurant });
    })
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {}
  Restaurant.find({limit: 10})
    .then((restaurants) => {
      res.render('restaurants', { restaurants });
    })
    .catch((error) => next(error));
);


// GET request to take to the create form view
router.get('/create', (req, res, next) => {
  res.render('restaurant/create-restaurant');
});

// POST request to create a restaurant document in the DB
router.post('/create', routeGuard, (req, res, next) => {
  const { name, address1, postalCode, city, country, cousine, price } =
    req.body;
  const { image } = req.body;

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
