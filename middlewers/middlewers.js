module.exports = {
  needLogin: (req, res, next) => {
    if(!req.cookies.NodeTaskTracker) {
      req.flash('warning', 'Please log in first...');
      res.redirect('/login');
    } else {
      next();
    }
  },
  loggedIn: (req, res, next) => {
    if(req.cookies.NodeTaskTracker) {
      req.flash('warning', 'You dont have permission to visit this page...');
      res.redirect('/');
    } else {
      next();
    }
  }
}
