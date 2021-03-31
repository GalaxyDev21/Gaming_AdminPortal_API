const jwt = require('express-jwt');
const config = require('../config/config');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

const getTokenFromHeaders = (req, res) => {
  const authorization = req.headers.authorization;
  //console.log('authorization', authorization)
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  } else {
    return null;
  }
};

const auth = {
  required: jwt({
    secret: config.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: config.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  isSuperadmin: function (req, res, next) {
    const { payload: { id } } = req;
    Users.findById(id).select('role').then(d => {
      if (d.role === 'superadmin') {
        req.body.loggedInUserData = d;
        return next();
      } else {
        return res.status(401).json({
          status: false,
          data: 'Not authorized',
        });
      }
    }).catch((err) => {
      return res.status(401).json({
        status: false,
        data: 'Not authorized',
        debug: err.toString(),
      });
    });

  },
  isAdmin: function (req, res, next) {
    console.log('Here....', req.payload);
    const { payload: { id } } = req;
    Users.findById(id).select('role').then(d => {
      if (d.role === 'superadmin' || d.role === 'admin') {
        req.body.loggedInUserData = d;
        return next();
      } else {
        return res.status(401).json({
          status: false,
          data: 'Not authorized',
        });
      }
    }).catch((err) => {
      login
      return res.status(401).json({
        status: false,
        data: 'Not authorized',
        debug: err.toString(),
      });
    });

  }
};

module.exports = auth;