// jshint esversion:10

require('dotenv').config();
const Restaurant = require('../../models/restaurant');
const User = require('../../models/user');
const Review = require('../../models/review');
const { Router } = require('express');
const router = Router();
const upload = require('../../middleware/file-upload');
const axios = require('axios');
const routeGuardMiddleware = require('../../middleware/route-guard');

// Function that formats GEOCODING URL
const GEOCODING_URL = require('./getLngLat');
// Function that sorts by proximity
const restaurantsSorted = require('./sortByProximity');

const EARTH_RADIUS = 3963.2;

// import middlewares
const routeGuard = require('../../middleware/route-guard');

// GET request to display restaurants (divided into sections)
router.get('/', (req, res, next) => {
  Restaurant.find()
    .limit(10)
    .sort({
      rating: -1
    })
    .then((restaurants) => {
      res.render('restaurant/restaurants', {
        restaurants
      });
    })
    .catch((error) => next(error));
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  const { search, city, rating, price } = req.body;

  Restaurant.find({
    $text: {
      $search: search
    },
    city
  })
    .then((restaurants) => {
      res.render('restaurant/search-restaurants', {
        restaurants
      });
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
  if (req.file) {
    image = req.file.path;
  }

  let restaurantID;

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
    .then((restaurant) => {
      restaurantID = restaurant._id;

      return User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { discoveries: restaurantID }
        },
        { new: true }
      );
    })
    .then((creator) => {
      res.redirect('/restaurants');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/location', (req, res, next) => {
  const { lon, lat } = req.query;

  // Using this route to handle all request from the client side regarding user's current location.

  // Using MongoDB geoWithin and centerSphere to be able to get restaurants locations within a radious of 10 miles -- to be changed to meters

  Restaurant.find({
    position: {
      $geoWithin: {
        $centerSphere: [[lon, lat], 10 / EARTH_RADIUS]
      }
    }
  })
    .then((restaurants) => {
      // Adding distance from user location in order to sort data and send it to client side
      res.json(restaurantsSorted(restaurants, lon, lat));
      // res.end();
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/restaurant/:id', (req, res, next) => {
  const { id } = req.params;
  let numberOfReviews;
  Restaurant.findById(id)
    .populate({ path: 'reviews', populate: { path: 'creator' } })
    .then((restaurant) => {
      let numberOfReviews = restaurant.reviews.length;
      res.render('restaurant/restaurant', {
        restaurant,
        numberOfReviews
      });
    })
    .catch((error) => next(error));
});

//Add review to a restaurant upon POST request
router.post(
  '/restaurant/:id/review',
  routeGuardMiddleware,
  (req, res, next) => {
    const { id } = req.params;
    let creator = req.user.id;
    let newReview;
    const reviewRating = req.body.rate;
    const reviewPricing = req.body.price;
    let numberOfReviews;
    let ratingAverage = 0;
    let pricingAverage = 0;
    let promises = [];

    console.log(req.body);

    Review.create({
      content: req.body.reviewRestaurant,
      rating: reviewRating,
      pricing: reviewPricing,
      restaurant: id,
      creator: creator,
      likes: 0
    })
      .then((review) => {
        newReview = review;
        return Restaurant.findByIdAndUpdate(
          id,
          {
            $push: { reviews: review }
          },
          { new: true }
        );
      })

      .then((newRestaurant) => {
        numberOfReviews = newRestaurant.reviews.length;

        newRestaurant.reviews.forEach((singleReview) => {
          promises.push(
            Review.findById(singleReview).then((document) => {
              ratingAverage = ratingAverage + document.rating / numberOfReviews;
              pricingAverage =
                pricingAverage + document.pricing / numberOfReviews;
            })
          );
        });
        return Promise.all(promises);
      })
      .then(() => {
        return Restaurant.findByIdAndUpdate(
          id,
          {
            rating: Number.parseFloat(ratingAverage).toFixed(1),
            pricing: Number.parseFloat(pricingAverage).toFixed(1)
          },
          { new: true }
        );
      })
      .then(() => {
        return User.findByIdAndUpdate(
          creator,
          {
            $push: { reviews: newReview }
          },
          { new: true }
        );
      })
      .then(() => {
        res.redirect(`/restaurants/restaurant/${id}`);
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
