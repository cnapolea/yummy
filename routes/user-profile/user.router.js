//This router handles following requests related to user profile:
//01: Show user profile
//02: Edit user profile
//03: Delete user profile

const express = require('express');
const User = require('./../models/user');
const routeGuardMiddleware = require('../middleware/route-guard');
const profileRouter = express.Router();

//01: Show user profile

//02: Edit user profile
profileRouter.get('/edit', routeGuardMiddleware, (req, res, next) => {
  res.render('profile/edit');
});

//03: Delete user profile

module.exports = profileRouter;
