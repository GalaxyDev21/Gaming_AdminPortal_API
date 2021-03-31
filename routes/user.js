const router = require('express').Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.route('/create').post(auth.required, userController.createUser);

router.route('/get-users').post(auth.required, userController.getUsers);

router.route('/get-system-users').post(auth.required, auth.isSuperadmin, userController.getSystemUsers);

router.route('/profile/:adminId').get(auth.required, userController.findSingleUser);

router.route('/current').get(auth.required, userController.currentUser);

router.route('/update/:adminId').put(auth.required, userController.updateUser);

router.route('/changePassword/:adminId').put(auth.required, userController.changePassword);

router.route('/delete/:adminId').delete(auth.required, userController.deleteUser);

module.exports = router;
