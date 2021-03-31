const router = require('express').Router();
const livebetsController = require('../controllers/live_betController');
const auth = require('../middleware/auth');

router.route('/get-live-bets').post(auth.required, livebetsController.getLiveBets);
router.route('/insert-demo-data').post(auth.required, auth.isSuperadmin, livebetsController.insertDemoData);

module.exports = router;
