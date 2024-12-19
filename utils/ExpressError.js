class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // Call the parent (Error) constructor
        this.statusCode = statusCode; // Add custom property
    }
}

module.exports = ExpressError;
