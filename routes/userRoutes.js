const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/forgot-password', userController.forgotPassword_get );
router.post('/send-reset-email', userController.sendResetEmail_post );
router.get('/reset-password', userController.resetPassword_get );
router.post('/reset-password', userController.resetPassword_post );

module.exports = router;