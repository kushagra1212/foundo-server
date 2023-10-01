"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.UpdateError = exports.MethodNotAllowedError = exports.NotAcceptableError = exports.ValidationError = exports.UnprocessableEntityError = exports.ConflictError = exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.TooManyRequestsError = exports.NotFoundError = exports.customErrorMappings = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Custom Error';
        this.statusCode = 500;
    }
}
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(message) {
        super(message);
        this.name = exports.customErrorMappings.ValidationError.ErrorName;
        this.statusCode = exports.customErrorMappings.ValidationError.ErrorStatusCode;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.name = exports.customErrorMappings.NotFoundError.ErrorName;
        this.statusCode = exports.customErrorMappings.NotFoundError.ErrorStatusCode;
    }
}
exports.NotFoundError = NotFoundError;
class TooManyRequestsError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Too Many Requests Error';
        this.statusCode = 429;
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.name = exports.customErrorMappings.BadRequestError.ErrorName;
        this.statusCode = exports.customErrorMappings.BadRequestError.ErrorStatusCode;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized Error';
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Forbidden Error';
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Internal Server Error';
        this.statusCode = 500;
    }
}
exports.InternalServerError = InternalServerError;
class ConflictError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Conflict Error';
        this.statusCode = 409;
    }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Unprocessable Entity Error';
        this.statusCode = 422;
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class NotAcceptableError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Not Acceptable Error';
        this.statusCode = 406;
    }
}
exports.NotAcceptableError = NotAcceptableError;
class MethodNotAllowedError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Method Not Allowed Error';
        this.statusCode = 405;
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class UpdateError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'Update Error';
        this.statusCode = 500;
    }
}
exports.UpdateError = UpdateError;
exports.customErrorMappings = {
    NotFoundError: {
        ErrorName: 'Not Found Error',
        ErrorStatusCode: 404,
    },
    TooManyRequestsError: {
        ErrorName: 'Too Many Requests Error',
        ErrorStatusCode: 429,
    },
    BadRequestError: {
        ErrorName: 'Bad Request Error',
        ErrorStatusCode: 400,
    },
    UnauthorizedError: {
        ErrorName: 'Unauthorized Error',
        ErrorStatusCode: 401,
    },
    ForbiddenError: {
        ErrorName: 'Forbidden Error',
        ErrorStatusCode: 403,
    },
    InternalServerError: {
        ErrorName: 'Internal Server Error',
        ErrorStatusCode: 500,
    },
    ValidationError: {
        ErrorName: 'Validation Error',
        ErrorStatusCode: 400,
    },
};
//# sourceMappingURL=customErrors.js.map