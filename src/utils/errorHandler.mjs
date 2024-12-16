class errorHandler extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
        data = null,
        success = false
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.success = success;
        this.errors = errors;

        // Ensure the stack trace is captured if not provided
        if (stack) {
            this.stack = stack;
        } else {
            // Capture the stack trace when it's not provided
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { errorHandler };
