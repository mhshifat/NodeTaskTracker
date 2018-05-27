const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const User = require("../models/User");

const middlewares = require("../middlewers/middlewers");

router.get('/', middlewares.needLogin, (req, res) => {
  User.findOne({username: req.cookies.NodeTaskTracker}).populate('tasks').exec((err, user) => {
    if(err) {
      req.flash('error', 'Something went wrong...');
      res.redirect('/');
    } else {
      res.render('pages/home', {tasks: user.tasks});
    }
  });
});

router.post('/task/create', (req, res) => {
  if(!req.body.task) {
    req.flash('warning', 'Please fill out the empty fields...');
    res.redirect('/');
  } else {
    Task.create({task: req.body.task}, (err, task) => {
      if(err) {
        req.flash('error', 'Something went wrong...');
        res.redirect('/');
      } else {
        User.findOne({username: req.cookies.NodeTaskTracker}).exec((err, user) => {
          if (err) {
            req.flash('error', 'Something went wrong...');
            res.redirect('/');
          } else {
            user.tasks.push(task);
            user.save((err) => {
              if (err) {
                req.flash('error', 'Something went wrong...');
                res.redirect('/');
              } else {
                req.flash('success', 'Your task has been saved...');
                res.redirect('/');
              }
            })
          }
        });
      }
    });
  }
});

router.get('/task/:id/markAsComplete', middlewares.needLogin, (req, res) => {
  Task.findByIdAndUpdate(req.params.id, {isCompleted: true}, (err, task) => {
    if (err) {
      req.flash('error', 'Something went wrong...');
      res.redirect('/');
    } else {
      req.flash('success', 'Your task has been marked as completed...');
      res.redirect('/');
    }
  });
});

router.get('/task/:id/delete', middlewares.needLogin, (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err, task) => {
    if (err) {
      req.flash('error', 'Something went wrong...');
      res.redirect('/');
    } else {
      req.flash('success', 'Your task has been deleted...');
      res.redirect('/');
    }
  });
});


module.exports = router;
