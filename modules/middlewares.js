module.exports = {
  redirectIfNotUser: (req, res, next) => {
    if (req.user == null && req.path.indexOf('app') !== -1) {
      console.log('redirecting from path: ' + req.path);
      res.redirect('/login.html');
    }
    next();
  }
};
