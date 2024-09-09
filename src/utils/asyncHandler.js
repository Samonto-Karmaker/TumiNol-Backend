const asyncHandler = requestHandlerFunction => {
	return (req, res, next) => {
		Promise.resolve(requestHandlerFunction(req, res, next)).catch(err => {
			next(err)
		})
	}
}

export default asyncHandler
