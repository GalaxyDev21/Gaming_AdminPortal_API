const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccontsSchema = new Schema({
    title: String,
    domain: String,
    prefix: String,
    callback_url: String,
    currency: String,
    status: Boolean,
    white_ips: String,
    is_live: Boolean,
    deleted: { type: Number, default: 0 },
    user_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    apikey_id: [{ type: Schema.Types.ObjectId, ref: 'Api_keys' }]

});
module.exports = mongoose.model('Accounts', AccontsSchema);