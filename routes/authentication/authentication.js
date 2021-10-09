'use strict';
// jshint esversion:10
const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../../models/user'); //provides user model
const routeGuardMiddleware = require('../../middleware/route-guard');
const upload = require('../../middleware/file-upload'); //handles file uploades
const router = new Router();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'test.ih.rmwdpt2021@gmail.com',
    pass: 'Ironhack2021'
  }
});

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
  let verificationCode = String(Math.random()).replace('.', '');
  //let verificationCodeHash;

  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name: { firstName, lastName },
        accountVerification: { code: verificationCode },
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
      let receiver = 'test.ih.rmwdpt2021@gmail.com';
      console.log(user.accountVerification.code);

      //send verification mail to user.
      return transporter.sendMail({
        to: receiver,
        subject: 'Please verify your yummy email adress',
        html: `<h1>PLEASE CONFIRM YOUR EMAIL ADRESS :) </h1>
        <a href='http://localhost:3000/profile/confirm/${user.accountVerification.code}'>
        Confirm Email adress</a>`
      });
    })
    .then(() => {
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

router.post('/email-check', (req, res, next) => {
  const { email } = req.query;
  User.find({ email })
    .then((documents) => {
      if (documents.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
