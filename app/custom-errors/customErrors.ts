class CustomError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'Custom Error';
    this.statusCode = 500;
  }
}

class ValidationError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Validation Error';
    this.statusCode = 400;
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
    this.statusCode = 404;
  }
}

class TooManyRequestsError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Too Many Requests Error';
    this.statusCode = 429;
  }
}

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Request Error';
    this.statusCode = 400;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized Error';
    this.statusCode = 401;
  }
}

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Forbidden Error';
    this.statusCode = 403;
  }
}

class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Internal Server Error';
    this.statusCode = 500;
  }
}

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Conflict Error';
    this.statusCode = 409;
  }
}

class UnprocessableEntityError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Unprocessable Entity Error';
    this.statusCode = 422;
  }
}
class NotAcceptableError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Not Acceptable Error';
    this.statusCode = 406;
  }
}

class MethodNotAllowedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Method Not Allowed Error';
    this.statusCode = 405;
  }
}

class UpdateError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'Update Error';
    this.statusCode = 500;
  }
}
export {
  NotFoundError,
  TooManyRequestsError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  ConflictError,
  UnprocessableEntityError,
  ValidationError,
  NotAcceptableError,
  MethodNotAllowedError,
  UpdateError,
  CustomError,
};
