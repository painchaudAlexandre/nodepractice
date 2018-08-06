require('babel-register');

class ApiHelper {
    successResponse(response, result, statusCode,) {
        if (statusCode === undefined) statusCode = 200
        response.status(statusCode).json(this.successResponseResult(result));
    }

    errorResponse(response,  message, code, statusCode) {
        if (statusCode === undefined) statusCode = 500
        response.status(statusCode).json(this.errorResponseResult(message, code));
    }

    successResponseResult(result) {
        return {
            success: true,
            result: result
        }
    }

    errorResponseResult(message, code) {
        if (code === undefined) code = 0
        if (message === undefined) message = ''
        return {
            success: false,
            message: message,
            code: code
        }
    }
}

module.exports = new ApiHelper()