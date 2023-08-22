const { Router } = require('express');
const authController = require('../controllers/authController');
const {alreadyAuthenticated} = require('../middlewares/index');

const router = Router();

router.get('/register', alreadyAuthenticated, authController.register_get);
router.post('/register', authController.register_post);
router.get('/login', alreadyAuthenticated, authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;