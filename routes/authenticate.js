const router = require('express').Router();
const basicController = require('../controllers/basicController');
const auth = require('../middleware/auth');

router.route('/authenticate').post(auth.optional, basicController.authenticate);

module.exports = router;
