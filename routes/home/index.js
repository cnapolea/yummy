'use strict';

const express = require('express');
const router = express.Router();
const routeGuardMiddleware = require('../../middleware/route-guard');
const User = require('../../models/user'); //provides user model
const Review = require('../../models/review');
const Restaurant = require('../../models/restaurant');

router.get('/', (req, res, next) => {
  res.render('home/index', { title: 'Yummy In My Tummy!' });
});

// Post request for the form in the homepage
router.post('/', (req, res, next) => {
  // Getting information from homepage form to query for restaurants base on the var names below defined
  // const { name, city, cousine, food } = req.body;

  /*
  Restaurant.find({city}).or();
  */

  res.render('home/index', { title: 'Yummy In My Tummy!' });
});

router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('home/index');
});

router.get('/explore-users', routeGuardMiddleware, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.render('home/exploreUsers', { users });
    })
    .catch((error) => {
      next(error);
    });
});

//Functioinality when liking a review
router.post(
  '/review/:reviewID/like',
  routeGuardMiddleware,
  (req, res, next) => {
    const reviewID = req.params.reviewID;

    Review.findByIdAndUpdate(reviewID, { $inc: { likes: 1 } }, { new: true })
      .populate('restaurant')
      .then((document) =>
        res.redirect(`/restaurants/restaurant/${document.restaurant._id}`)
      )
      .catch((error) => next(error));
  }
);

module.exports = router;
