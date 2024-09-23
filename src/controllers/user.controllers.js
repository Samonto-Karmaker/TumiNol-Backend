import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { register } from "../services/user.service.js"

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, userName, password } = req.body
	const files = req.files
	console.log(files)
	const createdUser = await register(fullName, email, userName, password, files)
	res
		.status(201)
		.json(new ApiResponse(201, "User registered successfully", createdUser))
})

export { registerUser }
