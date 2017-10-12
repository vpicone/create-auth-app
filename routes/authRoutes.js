const passport = require('passport');
const crypto = require('crypto');

module.exports = (app) => {
  app.get('/auth/reddit', (req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'permanent',
    })(req, res, next);
  });

  app.get('/auth/reddit/callback', (req, res, next) => {
    // Check for origin via state token
    if (req.query.state == req.session.state) {
      passport.authenticate('reddit', {
        successRedirect: '/',
        failureRedirect: '/login',
      })(req, res, next);
    } else {
      next(new Error(403));
    }
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
