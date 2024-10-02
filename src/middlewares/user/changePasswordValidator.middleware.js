import { check, validationResult } from "express-validator"
import ApiError from "../../utils/ApiError.js"

const changePasswordValidator = [
	check("newPassword")
		.isStrongPassword()
		.withMessage(
			"Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character"
		),
]

const changePasswordValidatorMiddleware = (req, res, next) => {
	const errors = validationResult(req)
	const mappedErrors = errors.mapped()
	if (Object.keys(mappedErrors).length === 0) {
		return next()
	}
	res
		.status(400)
		.json(new ApiError(400, "New password is not strong enough", mappedErrors))
}

export { changePasswordValidator, changePasswordValidatorMiddleware }
