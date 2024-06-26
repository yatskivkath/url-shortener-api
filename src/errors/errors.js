class NotFound extends Error {
    constructor(message = 'Not Found') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequest extends Error {
    constructor(message = 'Bad Request') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends Error {
    constructor(message = 'Validation Error') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

class Unauthorized extends Error {
    constructor(message = 'Unauthorized') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 401;
        Error.captureStackTrace(this, this.constructor);
    }
}

class Forbidden extends Error {
    constructor(message = 'Forbidden') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 403;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ServerError extends Error {
    constructor(message = 'Server Error') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

class TooManyRequests extends Error {
    constructor(message = 'Too Many Requests') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 429;
        Error.captureStackTrace(this, this.constructor);
    }
}

class UnprocessableContent extends Error {
    constructor(message = 'Unprocessable Content') {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = 422;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    NotFound,
    BadRequest,
    Unauthorized,
    Forbidden,
    ServerError,
    ValidationError,
    TooManyRequests,
    UnprocessableContent,
};
