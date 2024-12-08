class errorHandler extends Error {
    constructor(
        statusCode,
        message = "something is wrong",
        errors = [],
        stack = "",
        data = null,
        success = false,
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.success = success;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); // Fixed line
        }
    }
}

export { errorHandler };