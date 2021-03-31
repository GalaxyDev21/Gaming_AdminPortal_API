const mongoose = require('mongoose');
const { Schema } = mongoose;
const MessageSubportTicketsSchema = new Schema({
    content: String,
    create_date: Date,
    fileAttach: String,
    user_id: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    support_ticket_id: [{ type: Schema.Types.ObjectId, ref: 'Support_Tickets' }]
});
module.exports = mongoose.model('Message_Support_Tickets', MessageSubportTicketsSchema);