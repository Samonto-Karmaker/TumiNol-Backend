import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	login,
	refreshAccessToken,
	register,
} from "../services/user.service.js"
import ms from "ms"

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, userName, password } = req.body
	const files = req.files
	const createdUser = await register(fullName, email, userName, password, files)
	res
		.status(201)
		.json(new ApiResponse(201, "User registered successfully", createdUser))
})

const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body
	const { user, accessToken, refreshToken } = await login(username, password)

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		signed: true,
	}

	res
		.status(200)
		.cookie("accessToken", accessToken, {
			...cookieOptions,
			maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN),
		})
		.cookie("refreshToken", refreshToken, {
			...cookieOptions,
			maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
		})
		.json(new ApiResponse(200, "User logged in successfully", user))
})

const refreshAccessTokenController = asyncHandler(async (req, res) => {
	const incomingRefreshToken = req.signedCookies?.refreshToken
	const { accessToken, refreshToken } =
		await refreshAccessToken(incomingRefreshToken)

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		signed: true,
	}

	res
		.status(200)
		.cookie("accessToken", accessToken, {
			...cookieOptions,
			maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN),
		})
		.cookie("refreshToken", refreshToken, {
			...cookieOptions,
			maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
		})
		.json(new ApiResponse(200, "Access token refreshed successfully"))
})

export { registerUser, loginUser, refreshAccessTokenController }
