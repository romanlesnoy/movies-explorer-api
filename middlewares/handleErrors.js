const { SERVER_ERROR_MESSAGE } = require('../utils/responseMesseges');

module.exports.handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? SERVER_ERROR_MESSAGE
        : message,
    });
  next();
};
