import ApiError from "../../utils/ApiError.js"

const errorHandler = (err, req, res, next) => {
	let error = err
	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || 500
		const message = error.message || "Internal Server Error"
		error = new ApiError(statusCode, message, error?.errors || [], error?.stack)
	}
	const response = {
		statusCode: error.statusCode,
		message: error.message,
		errors: error.errors || [],
		...(process.env.NODE_ENV === "development" && { stack: error.stack }),
	}
	res.status(error.statusCode).json(response)
}

export default errorHandler
