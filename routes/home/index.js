'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('../../middleware/route-guard');

// Importing restaurant model in order to perform CRUD operations
const Restaurant = require('../../models/restaurant');

router.get('/', (req, res, next) => {
  res.render('home/index', { title: 'Tummy In My Tummy!' });
});

// Post request for the form in the homepage
router.post('/', (req, res, next) => {
  // Getting information from homepage form to query for restaurants base on the var names below defined
  // const { name, city, cousine, food } = req.body;

  /*
  Restaurant.find({city}).or();
  */

  res.render('home/index', { title: 'Tummy In My Tummy!' });
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('home');
});

module.exports = router;
