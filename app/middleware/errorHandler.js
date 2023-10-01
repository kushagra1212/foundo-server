"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._errorHandler = void 0;
const customErrors_1 = require("../custom-errors/customErrors");
const _errorHandler = (err, req, res, next) => {
    if (err instanceof customErrors_1.CustomError) {
        res
            .status(err.statusCode)
            .json({ error: err.name, errorMessage: err.message, success: false });
    }
    else {
        res.status(500).json({
            error: 'Internal Server Error',
            errorMessage: (err === null || err === void 0 ? void 0 : err.message) || 'Something went wrong',
            success: false,
        });
    }
};
exports._errorHandler = _errorHandler;
//# sourceMappingURL=errorHandler.js.map