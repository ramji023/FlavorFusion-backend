import { errorHandler } from "../utils/errorHandler.mjs";
// Global error handler middleware
export function handleGlobalError(err, req, res, next) {
    if (err instanceof errorHandler) {
        // Handle custom errors
        console.log("error : " ,err.message);
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data 
        });
    }

    // Handle unexpected errors (server errors)
    console.error(err); // Log the error stack for debugging purposes
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
        data: null
    });
};
