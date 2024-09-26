import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from "../utils/cloudinary.js"

// Helper functions
const generateAccessAndRefreshToken = async userId => {
	try {
		const user = await User.findById(userId)
		if (!user) {
			throw new ApiError(404, "User not found")
		}

		const accessToken = user.generateAccessToken()
		const refreshToken = user.generateRefreshToken()

		user.refreshToken = refreshToken
		await user.save()

		return { accessToken, refreshToken }
	} catch (error) {
		console.error("Failed to generate access and refresh token", error)
		throw new ApiError(500, "Failed to generate access and refresh token")
	}
}

// Service functions
const register = async (fullName, email, userName, password, files) => {
	const avatarLocalPath = files?.avatar?.[0]?.path
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar is required")
	}

	let coverImageLocalPath = null
	if (files?.coverImage && files.coverImage.length > 0) {
		coverImageLocalPath = files.coverImage[0].path
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath)
	if (!avatar) {
		throw new ApiError(500, "Failed to upload avatar")
	}

	let coverImage = null
	if (coverImageLocalPath) {
		coverImage = await uploadOnCloudinary(coverImageLocalPath)
		if (!coverImage) {
			throw new ApiError(500, "Failed to upload cover image")
		}
	}

	try {
		const user = await User.create({
			fullName,
			email,
			userName: userName.toLowerCase(),
			password,
			avatar: avatar.url,
			coverImage: coverImage?.url || "",
		})

		try {
			const createdUser = await User.findById(user._id).select(
				"-password -refreshToken"
			)
			if (!createdUser) {
				console.warn(`User not found with id: ${user._id}`)
				throw new ApiError(404, "User not found")
			}

			return createdUser
		} catch (error) {
			throw new ApiError(500, "Failed to fetch user", error)
		}
	} catch (error) {
		if (avatar) {
			await deleteFromCloudinary(avatar.public_id)
		}
		if (coverImage) {
			await deleteFromCloudinary(coverImage.public_id)
		}
		throw new ApiError(
			500,
			"Failed to create user and uploaded images are deleted",
			error
		)
	}
}

const login = async (username, password) => {
	// I am expecting username to be either email or userName
	if (!username || !password) {
		throw new ApiError(400, "Username and password are required")
	}

	const user = await User.findOne({
		$or: [{ email: username }, { userName: username }],
	})
	if (!user) {
		throw new ApiError(404, "User not found")
	}
	if (!(await user.isPasswordMatch(password))) {
		throw new ApiError(401, "Invalid credentials")
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	)

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	)
	if (!loggedInUser) {
		throw new ApiError(404, "User not found")
	}

	return { user: loggedInUser, accessToken, refreshToken }
}

const refreshAccessToken = async incomingRefreshToken => {
	if (!incomingRefreshToken) {
		throw new ApiError(400, "Refresh token is required")
	}

	try {
		const decodedUser = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		)
		if (!decodedUser) {
			throw new ApiError(401, "Invalid refresh token")
		}

		const user = await User.findById(decodedUser?._id)
		if (!user) {
			throw new ApiError(404, "User not found")
		}

		if (incomingRefreshToken !== user.refreshToken) {
			throw new ApiError(401, "Invalid refresh token")
		}

		const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
			user._id
		)

		return { accessToken, refreshToken }
	} catch (error) {
		console.error("Failed to refresh access token", error)
		throw new ApiError(500, "Failed to refresh access token", error)
	}
}

export { register, login }
