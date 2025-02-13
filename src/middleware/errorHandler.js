const { InternalServerError } = require("../utils/exception");

const errorHandler = (err, req, res, next) => {
  console.error("Error in errorHandler:", err);
  if (err instanceof InternalServerError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
// In the above snippet, we have created a middleware function called errorHandler that will catch all errors thrown by the application. If the error is an instance of InternalServerError, it will return the error message with the status code. Otherwise, it will return a generic error message with a status code of 500.
