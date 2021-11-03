const CustomError = require('./custom-error');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;