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
        console.log(err);
        throw new customErrors(err.statusCode || 500, err.message || "Internal Server Error", err.stack);
    }
}