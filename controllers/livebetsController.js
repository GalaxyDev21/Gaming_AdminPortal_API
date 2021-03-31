const mongoose = require('mongoose');
const LiveBets = mongoose.model('Live_Bets');
const auth = require('../middleware/auth');
const Users = mongoose.model('Users');

exports.getLiveBets = async function (req, res, next) {
    const {
        payload: { id },
        body: {
            keywords,
            from,
            to
        }
    } = req;
    var user = await Users.findById(id).then(data => data);
    const isSuperadmin = user.role === 'superadmin';
    console.log("id:" + id );
    console.log("role:" + user.role );
    return res.status(200).json({
        status: true,
        message: '',
        data: []
      });
};