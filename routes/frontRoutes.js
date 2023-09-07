const { Router } = require('express');
const frontController = require('../controllers/frontController');
const {isAuthenticated} = require('../middlewares/authMiddleware')

const router = Router();

router.get('/dashboard', isAuthenticated, frontController.dashboard_get);

module.exports = router;