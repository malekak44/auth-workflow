const Errors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { createTokenUser, attachCookiesToResponse } = require('../utils/index');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Errors.BadRequestError('Please provide name, email and password.');
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new Errors.BadRequestError('Email already exists');
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: { name, email, password, role } });

    res.status(StatusCodes.CREATED).json({ msg: 'user created successfully', user: tokenUser });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Errors.BadRequestError('Please provide email and password.');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Errors.UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new Errors.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: { email, password } });

    res.status(StatusCodes.CREATED).json({ msg: 'user logged in successfully', user: tokenUser });
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

const getUser = async (req, res) => {

}

const resetPassword = async (req, res) => {

}

const forgotPassword = async (req, res) => {

}

const verifyEmail = async (req, res) => {

}

module.exports = {
    register,
    login,
    logout,
    getUser,
    resetPassword,
    forgotPassword,
    verifyEmail,
}