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
    this.name = customErrorMappings.ValidationError.ErrorName;
    this.statusCode = customErrorMappings.ValidationError.ErrorStatusCode;
  }
}

class NotFoundError extends CustomError { 
  constructor(message: string) {
    super(message);
    this.name = customErrorMappings.NotFoundError.ErrorName;
    this.statusCode = customErrorMappings.NotFoundError.ErrorStatusCode;
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
    this.name = customErrorMappings.BadRequestError.ErrorName;
    this.statusCode = customErrorMappings.BadRequestError.ErrorStatusCode;
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

export const customErrorMappings = {
  NotFoundError:{
    ErrorName: 'Not Found Error',
    ErrorStatusCode: 404,
  },
  TooManyRequestsError:{
    ErrorName: 'Too Many Requests Error',
    ErrorStatusCode: 429,
  },
  BadRequestError:{
    ErrorName: 'Bad Request Error',
    ErrorStatusCode: 400,
  },
  UnauthorizedError:{
    ErrorName: 'Unauthorized Error',
    ErrorStatusCode: 401,
  },
  ForbiddenError:{
    ErrorName: 'Forbidden Error',
    ErrorStatusCode: 403,
  },
  InternalServerError:{
    ErrorName: 'Internal Server Error',
    ErrorStatusCode: 500,
  },
  ValidationError:{
    ErrorName: 'Validation Error',
    ErrorStatusCode: 400,
  },
};

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
