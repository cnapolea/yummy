const { Restaurant } = require('../../models/restaurant');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');

// GET request to take to the create form view
router.get('/create', (req, res, next) => {
  res.render('restaurant/create-restaurant');
});

// POST request to create a restaurant document in the DB
router.post('/create', (req, res, next) => {});

module.exports = router;
