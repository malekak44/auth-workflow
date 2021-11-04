const express = require('express');
const router = express.Router();

const { 
    register, 
    login ,
    getUser,
    logout,
    resetPassword,
    forgotPassword,
    verifyEmail,
} = require('../controllers/auth');

router.route('/').get(getUser);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/reset-password').post(resetPassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/verify-email').post(verifyEmail);

module.exports = router;