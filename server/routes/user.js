const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

const {
    getUser,
    getAllUsers,
} = require('../controllers/user');

router.route('/showMe').get(authenticateUser, getUser);
router.route('/all').get(authenticateUser, authorizeRoles('admin'), getAllUsers);

module.exports = router;