const mongoose = require('mongoose');
const SupportTickets = mongoose.model('Support_Tickets');
const MessageSupportTickets = mongoose.model('Message_Support_Tickets');
const Users = mongoose.model('Users');
const common = require('../utils/common');

exports.getSupportTickkets = async function (req, res, next) {
    const {
        payload: {
            id
        },
        body: {
            fromDate,
            toDate
        }
    } = req;
    const isSystemRole = await common.isSysemRole(id);
    if (isSystemRole) {
        SupportTickets.find({
            create_date: {
                $gte: fromDate,
                $lt: toDate
            }
        }).sort({
            update_date: -1
        }).populate('user_id', 'name').then(sptickkets => {
            return res.status(200).json({
                status: true,
                message: 'get support ticket successfuly',
                data: sptickkets
            });
        });

    } else {
        SupportTickets.find({
            create_date: {
                $gte: fromDate,
                $lt: toDate
            },
            user_id: id
        }).sort({
            update_date: -1
        }).populate('user_id', 'name').then(sptickkets => {
            return res.status(200).json({
                status: true,
                message: 'get support ticket successfuly',
                data: sptickkets
            });
        });
    }
};

exports.getMessageSupportTickkets = async function (req, res, next) {
    const {
        payload: {
            id
        }
    } = req;
    const support_ticket_id = req.params.Id;
    MessageSupportTickets.find({
        support_ticket_id: support_ticket_id
    }).populate('user_id', 'name role').then(msptickkets => {
        return res.status(200).json({
            status: true,
            message: 'get messsage support ticket successfuly',
            data: msptickkets
        });
    });

};

exports.sendSupportTickkets = async function (req, res, next) {
    const {
        payload: {
            id
        },
        body: {
            support_ticket_id,
            message,
            status,
            fileAttach,
        }
    } = req;

    const isSystemRole = await common.isSysemRole(id);
    if (isSystemRole && (!support_ticket_id || support_ticket_id == '')) {

        //super admin, can not creat support
        return res.status(200).json({
            status: true,
            message: 'get messsage support ticket successfuly',
            data: {}
        });

    }

    if (support_ticket_id == '') {

        const _supportTickets = {};
        _supportTickets.title = message;
        _supportTickets.create_date = new Date();
        _supportTickets.update_date = new Date();
        _supportTickets.status = 0; // is open
        _supportTickets.user_id = id;
        const finalSupportTickets = new SupportTickets(_supportTickets);

        const _messageSupportTickets = {};
        _messageSupportTickets.content = message;
        _messageSupportTickets.create_date = new Date();
        _messageSupportTickets.fileAttach = fileAttach;
        _messageSupportTickets.support_ticket_id = finalSupportTickets._id;
        _messageSupportTickets.user_id = id;
        const finalMessageSupportTickets = new MessageSupportTickets(_messageSupportTickets);

        finalSupportTickets.message_support_id = finalMessageSupportTickets._id;

        await finalMessageSupportTickets.save().then(p => {});
        await finalSupportTickets
            .save()
            .then(d => {

                res.json({
                    status: true,
                    message: 'Support Ticket created successfully!!',
                    data: d
                });

            })
            .catch(err =>
                res.json({
                    status: false,
                    message: 'Error in creating a Support Ticket',
                    data: err.toString()
                })
            );

    } else {

        const _supportTickets = {};
        _supportTickets.status = status;
        _supportTickets.update_date = new Date();

        await SupportTickets.findByIdAndUpdate({
                _id: support_ticket_id
            }, {
                $set: _supportTickets
            }, {
                new: true
            })
            .then(api => {

            })

        const _messageSupportTickets = {};
        _messageSupportTickets.content = message;
        _messageSupportTickets.fileAttach = fileAttach;
        _messageSupportTickets.create_date = new Date();
        _messageSupportTickets.support_ticket_id = support_ticket_id;
        _messageSupportTickets.user_id = id;
        const finalMessageSupportTickets = new MessageSupportTickets(_messageSupportTickets);

        await finalMessageSupportTickets.save().then(p => {

            res.json({
                status: true,
                message: 'Support Ticket updated successfully!!',
                data: p
            });

        });

    }

};

exports.changeStatusSupportTicket = async function (req, res, next) {
    const {
        payload: {
            id
        },
        body: {
            support_ticket_id,
            status
        }
    } = req;
    SupportTickets.findByIdAndUpdate({
        _id: support_ticket_id
    }, {
        status: status
    }).then(p => {
        return res.status(200).json({
            status: true,
            message: 'update status support ticket successfuly',
            data: p
        });
    });

};

exports.deleteTicket = function (req, res) {

    SupportTickets.findByIdAndRemove(req.params.ticketId)
        .select(['_id', 'title'])
        .then(ticket => {
            if (!ticket) {
                return res.status(404).send({
                    status: false,
                    message: 'Support ticket not found!',
                    data: []
                });

            } else {
                MessageSupportTickets.remove({
                    support_ticket_id: req.params.ticketId
                }).then(d => d);
                return res.status(200).json({
                    status: 'success',
                    message: 'Support ticket deleted successfully!',
                    data: ticket
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: 'Could not delete support ticket!',
                data: []
            });
        });

    return;
};