import { check, validationResult } from "express-validator"
import { User } from "../../models/User.js"
import ApiError from "../../utils/ApiError.js"
import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js"

const registerValidator = [
	check("fullName")
		.isLength({ min: 3 })
		.withMessage("Full name must be at least 3 characters long")
		.matches(/^[a-zA-Z\s]+$/)
		.withMessage(
			"Full name must not contain anything other than alphabet and spaces"
		)
		.trim(),
	check("userName")
		.isLength({ min: 3 })
		.withMessage("Username must be at least 3 characters long")
		.isAlphanumeric()
		.withMessage(
			"Username must not contain anything other than alphabet and number"
		)
		.trim()
		.custom(async value => {
			try {
				const user = await User.findOne({
					userName: value,
				})
				if (user) {
					throw new ApiError(400, "Username already exists")
				}
			} catch (error) {
				throw new ApiError(500, error.message)
			}
		}),
	check("email")
		.isEmail()
		.withMessage("Email must be a valid email address")
		.trim()
		.custom(async value => {
			try {
				const user = await User.findOne({
					email: value,
				})
				if (user) {
					throw new ApiError(400, "Email already exists")
				}
			} catch (error) {
				throw new ApiError(500, error.message)
			}
		}),
	check("password")
		.isStrongPassword()
		.withMessage(
			"Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character"
		),
]

const registerValidatorMiddleware = (req, res, next) => {
	const errors = validationResult(req)
	const mappedErrors = errors.mapped()
	if (Object.keys(mappedErrors).length === 0) {
		return next()
	}
	if (req.files) {
		deleteUploadedFiles(req.files)
	}
	res.status(400).json(new ApiError(400, "Invalid data", mappedErrors))
}

export { registerValidator, registerValidatorMiddleware }
