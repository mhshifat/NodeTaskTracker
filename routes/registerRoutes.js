const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const Task = require("../models/Task");
const User = require("../models/User");

const middlewares = require("../middlewers/middlewers");

router.get('/register', middlewares.loggedIn, (req, res) => {
  res.render('pages/register');
});

router.post('/register', (req, res) => {
  if(!req.body.username || !req.body.email || !req.body.password) {
    req.flash('warning', 'Please fill out the empty fields...');
    res.redirect('/register');
  } else {
    User.find({email: req.body.email}).exec((err, user) => {
      if(err) {
        req.flash('error', 'Something went wrong...');
        res.redirect('/register');
      } else {
        if(user.length > 0) {
          req.flash('error', 'User already exist...');
          res.redirect('/register');
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashPwd) => {
            if(err) {
              req.flash('error', 'Something went wrong...');
              res.redirect('/register');
            } else {
              const user = {
                username: req.body.username,
                email: req.body.email,
                password: hashPwd
              }
              User.create(user, (err, user) => {
                if(err) {
                  req.flash('error', 'Something went wrong...');
                  res.redirect('/register');
                } else {
                  req.flash('success', 'Your account has been created, you can log in now...');
                  res.redirect('/login');
                }
              });
            }
          });
        }
      }
    });
  }
});

module.exports = router;
