class ApiError extends Error {
	constructor(
		statusCode,
		message = "Internal Server Error",
		errors = [],
		stack = ""
	) {
		super(message)
		this.statusCode = statusCode
		this.errors = errors
		this.data = null
		this.message = message
		this.success = false

		if (stack) {
			this.stack = stack
		} else {
			Error.captureStackTrace(this, this.constructor)
		}

		Object.freeze(this)
	}
}

export default ApiError
