const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  password: String,
  role: String,
  hash: String,
  salt: String,
  name: String,
  faKey: String,
  platform: String,
  phone: String,
  city: String,
  country: String,
  address: String,
  balance_limit: Number,
  active: Boolean,
  account_id: [{ type: Schema.Types.ObjectId, ref: 'Accounts' }],
  apikey_id: [{ type: Schema.Types.ObjectId, ref: 'Api_keys' }],
  support_ticket_id: [{ type: Schema.Types.ObjectId, ref: 'Support_Tickets' }],
  parent_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
});

UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UsersSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      name: this.name,
      role: this.role,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    config.secret
  );
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    platform: this.platform,
    phone: this.phone,
    address: this.address,
    city: this.city,
    country: this.country,
    token: this.generateJWT()
  };
};

UsersSchema.methods.UserData = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    platform: this.platform,
    phone: this.phone,
    address: this.address,
    city: this.city,
    country: this.country
  };
};

module.exports = mongoose.model('Users', UsersSchema);
