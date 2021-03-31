const router = require('express').Router();
const mediaController = require('../controllers/mediaController');
const auth = require('../middleware/auth');
router.route('/upload-file').post(auth.required, mediaController.uploadFile);
module.exports = router;
