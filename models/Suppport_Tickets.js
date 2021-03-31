const mongoose = require('mongoose');
const { Schema } = mongoose;
const SubportTicketsSchema = new Schema({
    title: String,
    create_date: Date,
    update_date: Date,
    status: { type: Number, default: 0 },
    user_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    message_support_id: [{ type: Schema.Types.ObjectId, ref: 'Message_Support_Tickets' }]
});
module.exports = mongoose.model('Support_Tickets', SubportTicketsSchema);