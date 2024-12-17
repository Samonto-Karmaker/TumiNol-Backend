import { check, validationResult } from "express-validator"
import ApiError from "../../utils/ApiError.js"
import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js"

const videoDataValidator = [
	check("title")
		.isLength({ min: 3, max: 100 })
		.withMessage("Title should be between 3 to 100 characters")
		.trim(),
	check("description")
		.isLength({ min: 3, max: 1000 })
		.withMessage("Description should be between 3 to 1000 characters")
		.trim(),
]

const videoDataValidatorMiddleware = (req, res, next) => {
	const errors = validationResult(req)
	const mappedErrors = errors.mapped()
	if (Object.keys(mappedErrors).length === 0) {
		return next()
	}
	if (req.files) {
		deleteUploadedFiles(req.files)
	}
	res.send(400).json(new ApiError(400, "Invalid data", mappedErrors))
}

export { videoDataValidator, videoDataValidatorMiddleware }
