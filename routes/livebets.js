const router = require('express').Router();
const livebetsController = require('../controllers/livebetsController');
const auth = require('../middleware/auth');

router.route('/get-livebets').post(auth.required, livebetsController.getLiveBets);

module.exports = router;
