const { Restaurant } = require('../../models/restaurant');
const express = require('express');
const router = express.Router();

router.get('/create', (req, res, next) => {
  res.render('restaurant/create-restaurant');
});
