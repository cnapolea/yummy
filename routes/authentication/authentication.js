'use strict';
// jshint esversion:10
const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../../models/user'); //provides user model
const routeGuardMiddleware = require('../../middleware/route-guard');
const upload = require('../../middleware/file-upload'); //handles file uploades
const router = new Router();

//Handle user registration: render registration form upon GET request
router.get('/register', (req, res, next) => {
  res.render('authentication/register');
});

//Handle user registration: render registration form upon POST request
router.post('/register', upload.single('profilePicture'), (req, res, next) => {
  //get first name, last name, email, phone number and password from request body
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  //save uploaded profile picture, otherwise use default profile picture
  let profilePicture;
  if (req.file) {
    profilePicture = req.file.path;
  }
  let place;

  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name: { firstName, lastName },
        email,
        passwordHashAndSalt: hash,
        phoneNumber,
        profilePicture,
        place
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      //res.redirect('/private');
      console.log(user);
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', routeGuardMiddleware, (req, res, next) => {
  res.user = null;
  req.session.destroy();
  res.clearCookie('connect.sid', { path: '/' }); //removes cookie from browser history
  res.redirect('/');
});

module.exports = router;
