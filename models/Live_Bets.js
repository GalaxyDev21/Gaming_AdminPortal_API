const mongoose = require('mongoose');
const { Schema } = mongoose;
const LivebetsSchema = new Schema({
    uid: String,
    operatorId: String,
    nickName: String,
    tid: String,
    token: String,
    debitTransactionId: String,
    type: String,
    amount: Number,
    amount_text: String,
    update: Boolean,
    update_text: String,
    game: String,
    roundId: Number,
    tableId: Number,
    message: String,
    time: Number,
    date: Date
});
module.exports = mongoose.model('Live_Bets', LivebetsSchema);