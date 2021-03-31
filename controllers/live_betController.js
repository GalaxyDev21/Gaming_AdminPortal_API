const mongoose = require('mongoose');
const LiveBets = mongoose.model('Live_Bets');
const GameAccounts = mongoose.model('Game_Accounts');
const Accounts = mongoose.model('Accounts');
const ApiKeys = mongoose.model('Api_keys');
const common = require('../utils/common');
const cryptoRandomString = require('crypto-random-string');

exports.getLiveBets = async function (req, res, next) {
    const {
        payload: {
            id
        },
        body: {
            keywords,
            fromDate,
            toDate
        }
    } = req;

    const isSystemRole = await common.isSysemRole(id);

    if (isSystemRole) {
        LiveBets.find({
            date: {
                $gte: fromDate,
                $lt: toDate
            }
        }).then(lbItems => {

            if (lbItems) {

                const _lbItems = JSON.parse(JSON.stringify(lbItems));
                Promise.all(
                    _lbItems.map(async (item) => {
                        item.game_account = await GameAccounts.find({
                            login_id: item.uid
                        }).then(data => data[0]);
                    })
                ).then(resp => {
                    return res.status(200).json({
                        status: true,
                        message: 'get live bets successfuly',
                        data: _lbItems
                    });
                })

            } else {
                return res.status(404).send({
                    status: true,
                    message: 'get live bets successfuly',
                    data: []
                });
            }

        });

    } else {
        var gameAccountIDs = await GameAccounts.find({
            customer_id: id
        }).then(data => data.login_id);
        LiveBets.find({
            uid: {
                $in: gameAccountIDs
            },
            date: {
                $gte: from,
                $lt: to
            }
        }).then(liveBets => {

            const _lbItems = JSON.parse(JSON.stringify(liveBets));
                Promise.all(
                    _lbItems.map(async (item) => {
                        item.game_account = await GameAccounts.find({
                            login_id: item.uid
                        }).then(data => data[0]);
                    })
                ).then(resp => {
                    return res.status(200).json({
                        status: true,
                        message: 'get live bets successfuly',
                        data: _lbItems
                    });
                });

        });
    }
};

exports.insertDemoData = async function (req, res, next) {

    Accounts.find()
        .populate('user_id')
        .then(async (account) => {

            account.forEach(async (_account) => {

                var apiKey = await ApiKeys.find({
                    user_id: _account.user_id
                }).then(data => data);

                var _apiKey = apiKey[0];
                if (_apiKey) {

                    const _gameAccount = {};
                    _gameAccount.key = _apiKey.accessToken;
                    _gameAccount.user_id = _account.user_id[0]._id;
                    _gameAccount.login_id = _account.prefix + "_" + cryptoRandomString({
                        length: 8,
                        type: 'base64'
                    }).toUpperCase();
                    _gameAccount.alt_id = cryptoRandomString({
                        length: 8,
                        type: 'base64'
                    });
                    _gameAccount.nick = _account.user_id[0].name;
                    _gameAccount.name = _account.user_id[0].name;
                    _gameAccount.email = `demo_${_account._id}@gmail.com`;
                    _gameAccount.password = "12345678";
                    _gameAccount.customer_id = _account.user_id[0]._id;
                    _gameAccount.account_id = _account._id;
                    const gameAccounts = new GameAccounts(_gameAccount);
                    gameAccounts.save().then();

                    const _liveBets = {};
                    _liveBets.uid = _gameAccount.login_id;
                    _liveBets.operatorId = _account._id;
                    _liveBets.nickName = _account.user_id.name;
                    _liveBets.tid = 'b23b6a47-bd5b-4167-90b8-b2c1fb612082';
                    _liveBets.token = _apiKey.accessToken;
                    _liveBets.debitTransactionId = '066024ff-7dd4-4881-a505-352adab47d9d';
                    _liveBets.type = 'credit';
                    _liveBets.amount = 4.0;
                    _liveBets.amount_text = '4.0';
                    _liveBets.update = true;
                    _liveBets.update_text = 'Done';
                    _liveBets.game = 'sa_gaming';
                    _liveBets.roundId = 85367260;
                    _liveBets.tableId = 85367260;
                    _liveBets.message = '';
                    _liveBets.time = 1584985838;
                    _liveBets.date = new Date();

                    const liveBets = new LiveBets(_liveBets);
                    await liveBets.save().then();
                }

            });

            return res.status(200).json({
                status: true,
                message: 'insert demo data live bets successfuly',
                data: []
            });

        });
}