const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const enums = require('../utils/enums');

const Users = mongoose.model('Users');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then(user => {
          if (!user 
          || (user.role !== 'superadmin' && (user.active === false || user.active === null)) 
          || !user.validatePassword(password)) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);
