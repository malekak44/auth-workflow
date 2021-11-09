const Errors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const getUser = async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    res.status(StatusCodes.OK).json({ user: { userId: user._id, name: user.name, role: user.role } });
}

const getAllUsers = async (req, res) => {
    const users = await User.find({});

    res.status(StatusCodes.OK).json({ msg: 'All users fetched', users: users });
}

module.exports = { getUser, getAllUsers };