//This router handles following requests related to user profile:
//01: Show user profile
//02: Edit user profile
//03: Delete user profile

const express = require('express');
const User = require('./../../models/user');
const routeGuardMiddleware = require('../../middleware/route-guard');
const upload = require('../../middleware/file-upload'); //handles file uploades
const profileRouter = express.Router();

//01: Show user profile
profileRouter.get('/:userId', routeGuardMiddleware, (req, res, next) => {
  const { userId } = req.params;
  let userProfile;
  User.findById(userId)
    .then((document) => {
      userProfile = document;
      console.log(document);
      res.render('profile/userProfile', { user: document });
    })
    .catch((error) => {
      next(error);
    });
});

//02: Edit user profile
//GET: render editing page when user is authticated, otherwise throw error
profileRouter.get('/:userId/edit', routeGuardMiddleware, (req, res, next) => {
  const { userId } = req.params;
  let userProfile;
  User.findById(userId)
    .then((document) => {
      userProfile = document;
      console.log(document);
      res.render('profile/edit', { user: document });
    })
    .catch((error) => {
      next(error);
    });
});

//POST: update user profile with changes made in editing page
profileRouter.post('/:userId/edit', routeGuardMiddleware, (req, res, next) => {
  const { userId } = req.params; //get user id from path
  const { firstName, lastName, email, phoneNumber } = req.body; //get new user data from submitted form
  let userProfile;

  //find corresponding user profile by user ID and update changes. Then, redirect to user's profile page.
  User.findByIdAndUpdate(userId, {
    name: { firstName, lastName },
    email,
    phoneNumber
  })
    .then((document) => {
      userProfile = document;
      res.redirect(`/profile/${document._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

//GET request when user wants to change profile picture
profileRouter.get(
  '/:userId/change-picture',
  routeGuardMiddleware,
  (req, res, next) => {
    const { userId } = req.params; //get user id from path
    let userProfile;

    //find corresponding user profile by user ID and redirect to picture change page.
    User.findById(userId)
      .then((document) => {
        userProfile = document;
        res.render('profile/changePicture', { user: document });
      })
      .catch((error) => {
        next(error);
      });
  }
);

//POST request when user wants to change profile picture.
profileRouter.post(
  '/:userId/change-picture',
  routeGuardMiddleware,
  upload.single('profilePicture'),
  (req, res, next) => {
    const { userId } = req.params; //get user id from path
    let userProfile;
    let profilePicture;
    if (req.file) {
      profilePicture = req.file.path;
    }

    //find corresponding user profile by user ID and redirect to picture change page.
    User.findByIdAndUpdate(userId, { profilePicture })
      .then((document) => {
        userProfile = document;
        res.redirect(`/profile/${document._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

//03: Delete user profile
//GET: render page where user is asked if he/she really wants to delete profile (only when user is authticated), otherwise throw error
profileRouter.get('/:userId/delete', routeGuardMiddleware, (req, res, next) => {
  const { userId } = req.params;
  let userProfile;
  User.findById(userId)
    .then((document) => {
      userProfile = document;
      res.render('profile/delete', { user: document });
    })
    .catch((error) => {
      next(error);
    });
});

//POST: delete user (only when user is authticated) and redirect to home page, otherwise throw error
profileRouter.post(
  '/:userId/delete',
  routeGuardMiddleware,
  (req, res, next) => {
    const { userId } = req.params;
    User.findByIdAndDelete(userId)
      .then(() => {
        req.session.destroy();
        res.user = null;
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = profileRouter;
