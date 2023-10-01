"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMappings = void 0;
const logger_1 = __importDefault(require("../logger/logger"));
const mysqlErrorHandler = (err, req, res, next) => {
    logger_1.default.warn('Caught error in mysqlErrorHandler');
    err = err;
    if (err && err['code'] && exports.errorMappings[err['code']]) {
        const errorMapping = exports.errorMappings[err['code']];
        return res.status(errorMapping.status).send({
            error: 'something went wrong',
            errorMessage: errorMapping.message,
            success: false,
        });
    }
    next(err);
};
exports.default = mysqlErrorHandler;
exports.errorMappings = {
    ER_DATA_TOO_LONG: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_DUP_ENTRY: {
        message: 'This record already exists. Please provide unique data.',
        status: 409, // Conflict
    },
    ER_NO_REFERENCED_ROW: {
        message: 'The referenced record does not exist.',
        status: 404, // Not Found
    },
    ER_NO_REFERENCED_ROW_2: {
        message: 'The referenced record does not exist.',
        status: 404, // Not Found
    },
    ER_BAD_NULL_ERROR: {
        message: 'A required field cannot be empty.',
        status: 400, // Bad Request
    },
    ER_PARSE_ERROR: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_TRUNCATED_WRONG_VALUE: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_DATA_OUT_OF_RANGE: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_NO_DEFAULT_FOR_FIELD: {
        message: 'A required field cannot be empty.',
        status: 400, // Bad Request
    },
    ER_WRONG_VALUE_FOR_VAR: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_CANT_UPDATE_WITH_READLOCK: {
        message: 'The record is locked.',
        status: 403, // Forbidden
    },
    ER_CANT_CREATE_USER_WITH_GRANT: {
        message: 'You are not authorized to perform this action.',
        status: 403, // Forbidden
    },
    ER_WRONG_VALUE_COUNT: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_TOO_MANY_ROWS: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_NOT_SUPPORTED_AUTH_MODE: {
        message: 'You are not authorized to perform this action.',
        status: 403, // Forbidden
    },
    ER_SP_NO_RECURSIVE_CREATE: {
        message: 'You are not authorized to perform this action.',
        status: 403, // Forbidden
    },
    ER_SP_ALREADY_EXISTS: {
        message: 'This record already exists. Please provide unique data.',
        status: 409, // Conflict
    },
    ER_SP_DOES_NOT_EXIST: {
        message: 'The referenced record does not exist.',
        status: 404, // Not Found
    },
    ER_WARN_OUT_OF_RANGE: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_BODY: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_SELECT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_SET: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_SCALE: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_PRECISION: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FIELDLENGTH: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_UNCOMPRESS: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_ZEROFILL: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_GEOMETRY: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_INTERVAL: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_PARTITION: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_ROWSIZE: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_KEY: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_INSERT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_SELECT_IN_LIMIT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_EREGEXP: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_VIEW: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_SUBSELECT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_MS: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_AUTO_KEY: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_BIG_FOR_KEY_PART: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_STRING: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_IDENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_TABLE_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_FIELD_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_INDEX_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_FOREIGN_KEY_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_TRIGGER_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_PARTITION_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_EVENT_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_USER_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_ENGINE_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_DATA_TYPE_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_TABLE_OPTIONS_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_VIEW_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_ROUTINE_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_DEFAULT_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_COLUMN_COMMENT: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_TOO_LONG_INDEX_COMMENT_FOR_COLUMN: {
        message: 'The data provided is too long for this field.',
        status: 400, // Bad Request
    },
    ER_WARN_DATA_OUT_OF_RANGE: {
        message: 'Invalid data format. Please check your input.',
        status: 400, // Bad Request
    },
};
//# sourceMappingURL=mysqlError.js.map