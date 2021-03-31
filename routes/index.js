const router = require('express').Router();
const authenticate = require('./authenticate');
const user = require('./user');
const account = require('./account');
const apikey = require('./api_key');
const livebet = require('./live_bets');
const supportTicket = require('./support_ticket');
const media = require('./media');

router.use('/v1', authenticate);
router.use('/v1/user', user);
router.use('/v1/account', account);
router.use('/v1/apikey', apikey);
router.use('/v1/livebet', livebet);
router.use('/v1/supportticket', supportTicket);
router.use('/v1/media', media);

module.exports = router;