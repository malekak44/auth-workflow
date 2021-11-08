const {
    createTokenUser,
    sendVerificationEmail,
    sendResetPasswordEmail,
    attachCookiesToResponse,
} = require('../utils/index');
const crypto = require('crypto');
const Errors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const origin = 'http://localhost:3000';

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

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({ name, email, password, role, verificationToken });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: { name, email, password, role } });

    const emailUrl = await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin,
    });

    res.status(StatusCodes.CREATED).json({
        msg: `Success! Please go to the link to verify account ⬇ \n ${emailUrl}`,
        user: tokenUser,
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Errors.BadRequestError('Please provide email and password.');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new Errors.UnauthenticatedError('Password is not correct');
    }

    if (!user.isVerified) {
        const emailUrl = await sendVerificationEmail({
            name: user.name,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        });

        throw new Errors.UnauthenticatedError(`Please go to the link to verify account ⬇ \n ${emailUrl}`);
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

const verifyEmail = async (req, res) => {
    const { email, verificationToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    if (user.verificationToken !== verificationToken) {
        throw new Errors.UnauthenticatedError('Token does not match');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Account Confirmed' });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Errors.BadRequestError('Please provide valid email');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    const passwordToken = crypto.randomBytes(30).toString('hex');
    const emailUrl = await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        passwordToken: passwordToken,
        origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: emailUrl });
}

const resetPassword = async (req, res) => {
    const { email, password, passwordToken } = req.body;
    if (!email, !password, !passwordToken) {
        throw new Errors.BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Errors.UnauthenticatedError('User does not exist');
    }

    const currentDate = new Date();

    if (user.passwordToken === passwordToken && user.passwordTokenExpirationDate > currentDate) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
    }

    res.status(StatusCodes.OK).json({ msg: 'Password reseted successfully' });
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}