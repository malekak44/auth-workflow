const Errors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const getUser = async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    res.status(StatusCodes.OK).json({ user });
}

const getAllUsers = async (req, res) => {
    const users = await User.find({});

    res.status(StatusCodes.OK).json(users);
}

module.exports = { getUser, getAllUsers };