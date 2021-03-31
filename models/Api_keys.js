const mongoose = require('mongoose');
const { Schema } = mongoose;
const ApiKeysSchema = new Schema({
    id: String,
    name: String,
    key: String,
    password: String,
    hmac_secret: String,
    callback_url: String,
    accessToken: String,
    key_live: Boolean,
    key_status: Boolean,
    deleted: { type: Number, default: 0 },
    user_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
});
module.exports = mongoose.model('Api_keys', ApiKeysSchema);