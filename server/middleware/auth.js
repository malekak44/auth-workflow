const Errors = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    let token;

    // check header
    const authHeader = req.header.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }

    // check cookies
    if (req.cookie.token) {
        token = req.cookie.token;
    }

    if (!token) {
        throw new Errors.UnauthenticatedError('No token found');
    }

    try {
        const payload = isTokenValid(token);

        // attach the user and his permissions to the req object
        req.user = {
            userId: payload.user.userId,
            role: payload.user.role,
        };

        next();
    } catch (error) {
        throw new Errors.UnauthenticatedError('Authentication invalid');
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new Errors.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    }
}

module.exports = { authenticateUser, authorizeRoles };