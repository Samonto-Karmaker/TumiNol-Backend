import jwt from "jsonwebtoken"
import { User } from "../../models/User.js"
import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils/asyncHandler.js"

export const checkAuth = asyncHandler(async (req, res, next) => {
	const token =
		req.signedCookies?.accessToken || req.header("Authorization")?.split(" ")[1]

	if (!token) {
		throw new ApiError(401, "Unauthorized")
	}

	try {
		const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		if (!decodedUser) {
			throw new ApiError(401, "Unauthorized")
		}

		const loggedInUser = await User.findById(decodedUser?._id).select(
			"-password -refreshToken"
		)
		if (!loggedInUser) {
			throw new ApiError(404, "User not found")
		}

		req.user = loggedInUser
		next()
	} catch (error) {
		console.error("Failed to authenticate user", error)
		throw new ApiError(401, error?.message || "Unauthorized")
	}
})
