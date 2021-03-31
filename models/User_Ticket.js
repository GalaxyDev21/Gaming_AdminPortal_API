const mongoose = require('mongoose');
const { Schema } = mongoose;
const GameAccountsSchema = new Schema({
    key: String,
    user_id: String,
    login_id: String,
    alt_id: String,
    nick: String,
    name: String,
    email: String,
    password: String,
    customer_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
});
module.exports = mongoose.model('User_Tickes', GameAccountsSchema);