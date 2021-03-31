const mongoose = require('mongoose');
const Accounts = mongoose.model('Accounts');
const Users = mongoose.model('Users');
const Api_keys = mongoose.model('Api_keys');
const common = require('../utils/common');

exports.createAccount = async function (req, res) {
    const {
        body: {
            user_id,
            title,
            domain,
            prefix,
            callback_url,
            currency,
            white_ips,
            status,
            is_live
        }
    } = req;

    const {
        payload: {
            id
        }
    } = req;
    
    const isSystemRole = await common.isSysemRole(id);
    if (!isSystemRole) {
        return res.status(404).send({
            status: false,
            message: 'Account not found!',
            data: []
        });
    }

    const account = {};
    account.title = title;
    account.domain = domain;
    account.prefix = prefix;
    account.callback_url = callback_url;
    account.currency = currency;
    account.white_ips = white_ips;
    account.status = status;
    account.is_live = is_live;
    account.user_id = user_id;

    const finalAccount = new Accounts(account);
    const IsExist = await Accounts.find({
        domain: domain
    }).then(data => data);
    if (IsExist.length > 0) {
        console.log('Account already exist')
        return res.status(200).json({
            status: false,
            message: 'Account already Exist!',
            data: []
        });
    }

    const accountID = {}
    accountID.account_id = finalAccount._id;

    Users.findByIdAndUpdate({
            _id: user_id
        }, {
            $set: accountID
        }, {
            new: true
        })
        .then(account => {
            // console.log('account in users collection==', account)
        }).catch(err => {
            // console.log('error in update account id in users collections', err)
        })

    await finalAccount
        .save()
        .then(d => {
            res.json({
                status: 'success',
                message: 'Account created successfully!!',
                data: d
            });
        })
        .catch(err =>
            res.json({
                status: false,
                message: 'Error in creating a Account',
                data: err.toString()
            })
        );

};


// view Account
exports.viewAccount = function (req, res) {
    const id = req.params.Id;
    Accounts.find({
            user_id: id
        })
        .then(account => {
            if (!account) {
                return res.status(404).send({
                    status: false,
                    message: 'Account not find with id' + req.params.userId,
                    data: []
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'Fetched Account successfully!',
                    data: account
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: err.message || 'Something went wrong while retrieving account!',
                data: []
            });
        });

    return;
};


// Update account
exports.updateAccount = async function (req, res) {
    const {
        user_id,
        title,
        domain,
        prefix,
        callback_url,
        currency,
        white_ips,
        status,
        is_live
    } = req.body;

    const {
        payload: {
            id
        }
    } = req;
    
    const isSystemRole = await common.isSysemRole(id);
    if (!isSystemRole) {
        return res.status(404).send({
            status: false,
            message: 'Account not found!',
            data: []
        });
    }

    if (!user_id || !title || !domain || !callback_url || !white_ips || !status || !is_live) {
        return res.status(200).json({
            status: false,
            message: 'All Fields are required',
            data: []
        });
    }

    const newAccount = {};
    newAccount.title = title;
    newAccount.domain = domain;
    newAccount.prefix = prefix;
    newAccount.callback_url = callback_url;
    newAccount.currency = currency;
    newAccount.white_ips = white_ips;
    newAccount.status = status;
    newAccount.is_live = is_live;
    newAccount.user_id = user_id;

    Accounts.findByIdAndUpdate({
            _id: req.params.accountId
        }, {
            $set: newAccount
        }, {
            new: true
        })
        .then(account => {
            if (!account) {
                res.status(404).send({
                    status: false,
                    message: 'Account not found!',
                    data: []
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'Account updated successfully!',
                    data: account
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: 'Something wrong updating Account!',
                data: []
            });
        });

    return;
};





exports.allAccounts = function (req, res) {
    Accounts.find()
        .then(accounts => {
            return res.status(200).json({
                status: 'success',
                message: 'Fetched all accounts successfully!',
                data: accounts
            });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: err.message || 'Something went wrong while retrieving accounts!',
                data: []
            });
        });

    return;
};

// Delete Account
exports.deleteAccount = async function (req, res) {
    
    const {
        payload: {
            id
        }
    } = req;
    
    const isSystemRole = await common.isSysemRole(id);
    if (!isSystemRole) {
        return res.status(404).send({
            status: false,
            message: 'Account not found!',
            data: []
        });
    }

    Accounts.findByIdAndRemove(req.params.acountId)
        .select(['_id', 'domain'])
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: false,
                    message: 'Account not found!',
                    data: []
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'Account deleted successfully!',
                    data: user
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: 'Could not delete account!',
                data: []
            });
        });

    return;
};