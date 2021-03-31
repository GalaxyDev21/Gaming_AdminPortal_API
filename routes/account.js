const router = require('express').Router();
const auth = require('../middleware/auth');
const accountController = require('../controllers/accountController');

router.route('/create').post(auth.required, accountController.createAccount);
router.route('/view/:Id').get(auth.required, accountController.viewAccount);
router.route('/update/:accountId').put(auth.required, accountController.updateAccount);
router.route('/get-accounts').get(auth.required, accountController.allAccounts);
router.route('/delete/:acountId').delete(auth.required, accountController.deleteAccount);

module.exports = router;