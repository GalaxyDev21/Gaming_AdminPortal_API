const mongoose = require('mongoose');
const Api_keys = mongoose.model('Api_keys');
const Users = mongoose.model('Users');
const cryptoRandomString = require('crypto-random-string');

exports.requestNewApikey = async function (req, res) {
    const {
        body: {
            user_id,
            id
        }
    } = req;

    const getUser = await Users.findById(user_id).then(data => data);
    if (IsExistUser == null ) {
        return res.status(200).json({
            status: false,
            message: 'User not found!',
            data: []
        });
    }

    const finalApikey = {};
    finalApikey.accessToken  = cryptoRandomString({length: 31, type: 'base64'}).toUpperCase();
    finalApikey.key = finalApikey.accessToken;
    
    await Api_keys.findByIdAndUpdate({
        _id: id
      }, {
        $set: finalApikey
      }, {
        new: true
      })
      .then(api => {
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
      }).catch(err => {
        return res.status(500).send({
          status: false,
          message: 'Something wrong generate api key !',
          data: []
        });
      });

}