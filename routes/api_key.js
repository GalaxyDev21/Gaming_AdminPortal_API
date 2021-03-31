const router = require('express').Router();
const auth = require('../middleware/auth');
const accountController = require('../controllers/api_keyController');
router.route('/request-new-key').post(auth.required, accountController.requestNewApikey);
module.exports = router;