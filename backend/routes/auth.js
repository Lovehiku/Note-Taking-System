const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const {authenticate} = require('../middleware/auth');


//signup route
router.post('/signup', authController.signup);

//login route
router.post('/login', authController.login);

// current user
router.get('/me', authenticate, authController.me);

module.exports = router;
