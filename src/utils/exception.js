class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message || "Resource Not Found", 404);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message || "Unauthorized", 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message || "Forbidden", 403);
  }
}

class InternalServerError extends CustomError {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
