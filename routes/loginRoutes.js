const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const Task = require("../models/Task");
const User = require("../models/User");

const middlewares = require("../middlewers/middlewers");

router.get('/login', middlewares.loggedIn, (req, res) => {
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    req.flash('warning', 'Please fill out the empty fields...');
    res.redirect('/login');
  } else {
    User.findOne({email: req.body.email}).exec((err, user) => {
      if(err) {
        req.flash('error', 'Something went wrong...');
        res.redirect('/login');
      } else {
        if(!user) {
          req.flash('error', 'User not exist...');
          res.redirect('/register');
        } else {
          bcrypt.compare(req.body.password, user.password, (err, matched) => {
            if (err) {
              req.flash('error', 'Something went wrong...');
              res.redirect('/login');
            } else {
              if (!matched) {
                req.flash('warning', 'Password not matched...');
                res.redirect('/login');
              } else {
                res.cookie('NodeTaskTracker', user.username, {maxAge: 30 * 24 * 3600000});
                req.flash('success', `Welcome ${user.username}, Glad to have you onboard...`);
                res.redirect('/');
              }
            }
          });
        }
      }
    });
  }
});

router.get('/logout', middlewares.needLogin, (req, res) => {
  res.clearCookie("NodeTaskTracker");
  req.flash('success', `You Have been logged out...`);
  res.redirect('/login');
})

module.exports = router;
