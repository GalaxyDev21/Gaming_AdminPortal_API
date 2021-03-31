const router = require('express').Router();
const supportticketController = require('../controllers/support_ticketController');
const auth = require('../middleware/auth');

router.route('/get-support-tickets').post(auth.required, supportticketController.getSupportTickkets);
router.route('/get-message-support-tickets/:Id').get(auth.required, supportticketController.getMessageSupportTickkets);
router.route('/send-message-support-ticket').post(auth.required, supportticketController.sendSupportTickkets);
router.route('/change-status-support-ticket').post(auth.required, supportticketController.changeStatusSupportTicket);
router.route('/delete/:ticketId').delete(auth.required, supportticketController.deleteTicket);

module.exports = router;
