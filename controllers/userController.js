const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Accounts = mongoose.model('Accounts');
const Api_keys = mongoose.model('Api_keys');
var speakeasy = require('speakeasy');
var validator = require('email-validator');
const enums = require('../utils/jwtutils');
const cryptoRandomString = require('crypto-random-string');
const common = require('../utils/common');
const crypto = require('crypto');

// Create new User
exports.createUser = async function (req, res) {
  const {
    payload: {
      id
    },
    body: {
      // customer
      name,
      email,
      password,
      role,
      platform,
      phone,
      address,
      city,
      country,
      balance_limit,
      active,
      // api key
      k_name,
      accessToken,
      key_status,
      key_live
    }
  } = req;

  const isManager = await common.isRole(id, 'manager');
  const isSuperAdmin = await common.isRole(id, 'superadmin');
  const isCustomer = await common.isRole(id, 'customer');

  // if (!isManager && !isSuperAdmin) {
  //   return res.status(200).json({
  //     status: 'success',
  //     message: 'User create successfully!',
  //     data: {}
  //   });
  // }

  if(isCustomer && role !== "customer") {
      return res.status(200).json({
        status: 'success',
        message: 'User create successfully!',
        data: {}
      });
  }

  if (isManager && role === "superadmin") {
    return res.status(200).json({
      status: 'success',
      message: 'User create successfully!',
      data: {}
    });
  }

  if (!name) {
    return res.status(200).json({
      status: false,
      message: 'Name is required!',
      data: []
    });
  }

  if (!email) {
    return res.status(200).json({
      status: false,
      message: 'Email is required!',
      data: []
    });
  }

  if (!password) {
    return res.status(200).json({
      status: false,
      message: 'Password is required!',
      data: []
    });
  }

  if (!role) {
    return res.status(200).json({
      status: false,
      message: 'Select a Role!',
      data: []
    });
  }

  const apikeyObj = {};
  apikeyObj.name = k_name;
  //apikeyObj.accessToken = accessToken;
  apikeyObj.key_status = key_status;
  apikeyObj.key_live = key_live;

  let finalApikey = new Api_keys(apikeyObj);
  let apkey_id = finalApikey._id;

  const user = {};
  user.email = email;
  user.password = password;
  user.role = role;
  user.name = name;
  user.platform = platform;
  user.phone = phone;
  user.address = address;
  user.city = city;
  user.country = country;
  user.balance_limit = balance_limit;
  user.active = !active ? false : active;
  user.apikey_id = apkey_id;
  const secret = speakeasy.generateSecret({
    length: 20
  });
  user.faKey = secret.base32;
  user.parent_id = id;
  const finalUser = new Users(user);

  if (!validator.validate(user.email)) {
    return res.status(200).json({
      status: false,
      message: 'Email not valid!',
      data: []
    });
  }

  const IsExist = await Users.find({
    email: user.email
  }).then(data => data);
  if (IsExist.length > 0) {
    return res.status(200).json({
      status: false,
      message: 'Email already taken!',
      data: []
    });
  }

  finalUser.setPassword(user.password);

  finalApikey.user_id = finalUser._id;
  finalApikey.password = cryptoRandomString({
      length: 8,
      type: 'base64'
    }),
    finalApikey.hmac_secret = cryptoRandomString({
      length: 64,
      type: 'base64'
    }),
    finalApikey.accessToken = cryptoRandomString({
      length: 39,
      type: 'base64'
    }).toUpperCase();
  finalApikey.key = finalApikey.accessToken;

  await finalUser
    .save()
    .then(d => {
      res.json({
        status: 'success',
        message: 'user created successfully!!',
        data: finalUser.UserData()
      })
    })
    .catch(err =>
      res.json({
        status: false,
        message: 'Error in creating a user',
        data: err.toString()
      })
    );

  await finalApikey
    .save()
    .then(aky => {
      console.log(aky, 'api key saved')
    }).catch(err => {
      console.log('err in api key saving', err);
    })

  // console.log('newAdmin', newAdmin);
  // if (newAdmin) {
  // const sendmail = await mail.adminWelcomeEmail(newAdmin);
  //send email to user
  //   return res.json({
  //     status: true,
  //     data: newAdmin
  //   });
  // }

};

//Change user name and password
exports.changePassword = async (req, res, next) => {
  const {
    name,
    password
  } = req.body;
  const newPass = password
  const userId = req.params.adminId;

  Users.findOne({
      _id: userId
    })
    .then(user => {
      // console.log('user is finded', user);
    });

  const newUser = {}

  if (!newPass) {
    newUser.name = name;
  } else {
    const salt = this.salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hash = crypto.pbkdf2Sync(newPass, this.salt, 10000, 512, 'sha512').toString('hex');

    newUser.name = name;
    newUser.salt = salt;
    newUser.hash = hash;
  }



  Users.findByIdAndUpdate({
    _id: userId
  }, {
    $set: newUser
  }).then(changed => {
    try {
      return res.json({
        status: 200,
        message: "Password changed successfully",
        data: changed
      })
    } catch (err) {
      return res.json({
        status: "error",
        message: err,
      })
    }
  });
}

// Retrieve all users from database
exports.getUsers = async function (req, res) {
  const {
    payload: {
      id
    }
  } = req;
  const {
    searchKey
  } = req.body;

  const isManager = await common.isRole(id, 'manager');
  const isSuperAdmin = await common.isRole(id, 'superadmin');
  const isCustomer = await common.isRole(id, 'customer');

  var findUers = {};
  findUers.role = "customer";
  findUers._id = {
    $ne: id
  }
  if (isCustomer) {
    findUers.parent_id = id;
  }
  findUers.$or = [{
      name: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
    {
      email: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
    {
      phone: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
  ];
  Users.find(findUers)
    .select([
      '_id',
      'name',
      'role',
      'email',
      'platform',
      'phone',
      'address',
      'city',
      'country',
      'balance_limit',
      'active'
    ]).populate('account_id apikey_id')
    .then(users => {
      return res.status(200).json({
        status: 'success',
        message: 'Fetched all users successfully!',
        data: users
      });
    })
    .catch(err => {
      res.status(500).send({
        status: false,
        message: err.message || 'Something went wrong while retrieving users!',
        data: []
      });
    });
  return;
};

exports.getSystemUsers = async function (req, res) {
  const {
    payload: {
      id
    }
  } = req;
  const {
    searchKey
  } = req.body;

  const isSuperAdmin = await common.isRole(id, 'superadmin');
  if (!isSuperAdmin) {
    res.status(500).send({
      status: false,
      message: err.message || 'Something went wrong while retrieving users!',
      data: []
    });
  }

  var findUers = {};
  findUers._id = {
    $ne: id
  }
  findUers.role = ["superadmin", "manager"];
  findUers.$or = [{
      name: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
    {
      email: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
    {
      phone: {
        $regex: `^${searchKey}.*`,
        $options: 'si'
      }
    },
  ]
  Users.find(findUers)
    .select([
      '_id',
      'name',
      'role',
      'email',
      'platform',
      'phone',
      'address',
      'city',
      'country',
      'balance_limit',
      'active'
    ]).populate('account_id apikey_id')
    .then(users => {
      return res.status(200).json({
        status: 'success',
        message: 'Fetched all users successfully!',
        data: users
      });
    })
    .catch(err => {
      res.status(500).send({
        status: false,
        message: err.message || 'Something went wrong while retrieving users!',
        data: []
      });
    });
  return;
};

// current user
exports.currentUser = function (req, res, next) {
  const {
    payload: {
      id
    }
  } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          status: false,
          data: 'Please Login',
        });
      }
      return res.status(200).json({
        status: true,
        data: {
          user: user.toAuthJSON()
        }
      });
      // return res.json({ user: user.toAuthJSON() });
    });
};

// Get Single user
exports.findSingleUser = function (req, res) {
  Users.findById(req.params.adminId)
    .select([
      '_id',
      'name',
      'role',
      'email',
      'platform',
      'phone',
      'address',
      'city',
      'country',
      'balance_limit',
      'active'
    ])
    .then(user => {
      if (!user) {
        return res.status(404).send({
          status: false,
          message: 'user not find with id' + req.params.userId,
          data: []
        });
      } else {
        return res.status(200).json({
          status: 'success',
          message: 'Fetched user successfully!',
          data: user
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        status: false,
        message: err.message || 'Something went wrong while retrieving user!',
        data: []
      });
    });

  return;
};

// update user
exports.updateUser = async function (req, res) {

  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    city,
    country,
    platform,
    balance_limit,
    active,
    k_name,
    k_password,
    hmac_secret,
    accessToken,
    key_status,
    key_live,
    apikey_ID
  } = req.body;

  if (!name || !email || !phone || !k_password || !hmac_secret || !accessToken) {
    return res.status(200).json({
      status: false,
      message: 'All Fields are required',
      data: []
    });
  }

  const newUser = {};
  newUser.name = name;
  newUser.email = email;
  newUser.role = role;
  newUser.phone = phone;
  newUser.address = address;
  newUser.city = city;
  newUser.country = country;
  newUser.platform = platform;
  newUser.balance_limit = balance_limit;
  newUser.active = !active ? false : active;

  if (password && password !== '') {
    newUser.password = password;
    newUser.salt = crypto.randomBytes(16).toString('hex');
    newUser.hash = crypto
      .pbkdf2Sync(password, newUser.salt, 10000, 512, 'sha512')
      .toString('hex');
  }

  const newApikey = {};
  newApikey.name = k_name;
  newApikey.password = k_password;
  newApikey.hmac_secret = hmac_secret;
  newApikey.accessToken = accessToken;
  newApikey.accessToken = accessToken;
  newApikey.key_status = key_status;
  newApikey.key_live = key_live;

  await Users.findById(req.params.adminId)
    .then(user => {
      if (!user) {
        res.status(404).send({
          status: false,
          message: 'User not found!',
          data: []
        })
      }
    })


  await Api_keys.findByIdAndUpdate({
      _id: apikey_ID
    }, {
      $set: newApikey
    }, {
      new: true
    })
    .then(api => {
      // console.log('api', api)
    })

  await Users.findByIdAndUpdate({
      _id: req.params.adminId
    }, {
      $set: newUser
    }, {
      new: true
    })
    .select([
      '_id',
      'name',
      'role',
      'email',
      'phone',
      'address',
      'platform',
      'city',
      'country',
      'balance_limit',
      'active'
    ])
    .then(user => {
      if (!user) {
        res.status(404).send({
          status: false,
          message: 'User not found!',
          data: []
        });
      } else {
        return res.status(200).json({
          status: 'success',
          message: 'updated user successfully!',
          data: user
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        status: false,
        message: 'Something wrong updating user!',
        data: []
      });
    });

  return;
};

// Delete user
exports.deleteUser = async function (req, res) {

  const isManager = await common.isRole(id, 'manager');
  const isSuperAdmin = await common.isRole(id, 'superadmin');
  if (!isManager && !isSuperAdmin) {
    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully!',
      data: {}
    });
  }

  Users.findById(req.params.adminId)
    .then(user => {
      let accDatas = user.account_id;
      let apikeyData = user.apikey_id[0];
      if (accDatas) {
        accDatas.forEach((val, index) => {
          Accounts.findByIdAndRemove(val._id)
            .then(account => {
              console.log('account deleted ===>>>', account);
            })
        });
      }

      if (apikeyData) {
        Api_keys.findByIdAndRemove(apikeyData._id)
          .then(k => {
            console.log('api key deleted ===>>>', account);
          })
      }

    });

  Users.findByIdAndRemove(req.params.adminId)
    .select(['_id', 'name', 'role', 'email'])
    .then(user => {
      if (!user) {
        return res.status(404).send({
          status: false,
          message: 'User not found!',
          data: []
        });
      } else {
        return res.status(200).json({
          status: 'success',
          message: 'User deleted successfully!',
          data: user
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        status: false,
        message: 'Could not delete user!',
        data: []
      });
    });

  return;
};