import { customErrors } from "../utils/errorHandler.js";

export const customErrorHandler = (err, req, res, next) => {
    if (err.name === 'CastError') {
        const message = `Please enter valid fields : ${err.path}`;
        throw new customErrors(400, message); // 400 Bad Request
    }

    else if (err.name === 'ValidationError') {
        const message = `Validation failed in mongodb , Invalid: ${err.path}`;
        throw new customErrors(400, message); // 400 Bad Request
    }


    else {
        throw new customErrors(500, "Internal Server Error", err.stack);
    }
}