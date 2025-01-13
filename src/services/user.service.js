import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from "../utils/cloudinary.js"
import { extractPublicId } from "cloudinary-build-url"
import {
	STANDARD_LIMIT_PER_PAGE,
	HIGHEST_LIMIT_PER_PAGE,
} from "../constants.js"

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
		if (error instanceof ApiError) {
			throw error
		}
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

const logout = async userId => {
	await User.findByIdAndUpdate(userId, {
		$set: { refreshToken: "" },
	})
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
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to refresh access token", error)
		throw new ApiError(500, "Failed to refresh access token", error)
	}
}

const changePassword = async (userId, oldPassword, newPassword) => {
	if (!oldPassword || !newPassword) {
		throw new ApiError(400, "Old password and new password are required")
	}
	if (oldPassword === newPassword) {
		throw new ApiError(400, "Old password and new password cannot be the same")
	}

	const user = await User.findById(userId)
	if (!user) {
		throw new ApiError(404, "User not found")
	}
	if (!(await user.isPasswordMatch(oldPassword))) {
		throw new ApiError(401, "Invalid old password")
	}

	user.password = newPassword
	await user.save()
}

const updateAvatar = async (userId, file) => {
	if (!userId) {
		throw new ApiError(400, "User id is required")
	}

	const avatarLocalPath = file?.path
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar is required")
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath)
	if (!avatar?.url) {
		throw new ApiError(500, "Failed to upload avatar")
	}

	const user = await User.findById(userId).select("-password -refreshToken")
	if (!user) {
		throw new ApiError(404, "User not found")
	}

	const oldAvatarPublicId = extractPublicId(user.avatar)
	if (oldAvatarPublicId) {
		await deleteFromCloudinary(oldAvatarPublicId)
	}

	user.avatar = avatar.url
	return user.save()
}

const updateCoverImage = async (userId, file) => {
	if (!userId) {
		throw new ApiError(400, "User id is required")
	}

	const coverImageLocalPath = file?.path
	if (!coverImageLocalPath) {
		throw new ApiError(400, "Cover image is required")
	}

	const coverImage = await uploadOnCloudinary(coverImageLocalPath)
	if (!coverImage?.url) {
		throw new ApiError(500, "Failed to upload cover image")
	}

	const user = await User.findById(userId).select("-password -refreshToken")
	if (!user) {
		throw new ApiError(404, "User not found")
	}

	const oldCoverImagePublicId = extractPublicId(user.coverImage)
	if (oldCoverImagePublicId) {
		await deleteFromCloudinary(oldCoverImagePublicId)
	}

	user.coverImage = coverImage.url
	return user.save()
}

// Here we will only send the following information to the client
// Full Name, Username, Avatar, Cover Image, SubscriberCount, IsSubscribed
// If the user is the owner of the channel, we will also send the SubscribeToCount
const getChannelProfile = async (userName, accessingUserId) => {
	if (!userName || userName.trim() === "") {
		throw new ApiError(400, "Username is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user id is required")
	}

	const channel = await User.aggregate([
		{
			$match: { userName: userName.toLowerCase() },
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscribers",
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "subscriber",
				as: "subscribedTo",
			},
		},
		{
			$addFields: {
				subscriberCount: { $size: "$subscribers" },
				subscribeToCount: {
					$cond: {
						if: {
							$eq: ["$_id", accessingUserId],
						},
						then: { $size: "$subscribedTo" },
						else: -1,
					},
				},
				isSubscribed: {
					$cond: {
						if: {
							$in: [accessingUserId, "$subscribers.subscriber"],
						},
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$project: {
				fullName: 1,
				userName: 1,
				avatar: 1,
				coverImage: 1,
				subscriberCount: 1,
				subscribeToCount: 1,
				isSubscribed: 1,
			},
		},
	])

	console.log("Channel", channel)
	if (!channel || channel.length === 0) {
		throw new ApiError(404, "Channel not found")
	}

	return channel[0]
}

/* 
	watchHistory: [
		{
			_id,
			owner: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			thumbnail,
			title,
			views,
			duration,
			likesCount, // need a lookup with likes to calculate this
			createdAt,
		},
		... // other videos in the watch history
	],
*/

const getWatchHistory = async (
	userId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!userId) {
		throw new ApiError(400, "User id is required")
	}

	/* 
		$lookup returns an array of documents, so we need to unwind it
		if we want to use the fields of the document in the next stages

		$unwind is used to deconstruct an array field from the input documents 
		to output a document for each element.
	*/

	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit")
	}

	const totalVideos = await User.findById(userId)
		.select("watchHistory")
		.then(user => user.watchHistory.length)

	if (totalVideos === 0) {
		return {
			watchHistory: [],
			totalVideos: 0,
			totalPages: 0,
			currentPage: page,
		}
	}

	const watchHistoryData = await User.aggregate([
		{
			$match: { _id: userId },
		},
		{
			$unwind: "$watchHistory",
		},
		{
			$lookup: {
				from: "videos",
				localField: "watchHistory",
				foreignField: "_id",
				as: "watchHistory",
			},
		},
		{
			$unwind: "$watchHistory",
		},
		{
			$lookup: {
				from: "users",
				localField: "watchHistory.owner",
				foreignField: "_id",
				as: "owner",
			},
		},
		{
			$unwind: "$owner",
		},
		{
			$lookup: {
				from: "likes",
				localField: "watchHistory._id",
				foreignField: "video",
				as: "likes",
			},
		},
		{
			$addFields: {
				"watchHistory.likeCount": { $size: "$likes" },
				"watchHistory.owner": {
					_id: "$owner._id",
					fullName: "$owner.fullName",
					avatar: "$owner.avatar",
				},
			},
		},
		{
			$project: {
				"watchHistory._id": 1,
				"watchHistory.owner": 1,
				"watchHistory.thumbnail": 1,
				"watchHistory.title": 1,
				"watchHistory.duration": 1,
				"watchHistory.views": 1,
				"watchHistory.likeCount": 1,
				"watchHistory.createdAt": 1,
			},
		},
		{
			$skip: (page - 1) * limit,
		},
		{
			$limit: limit,
		},
	])

	if (!watchHistoryData) {
		throw new ApiError(500, "Failed to fetch watch history")
	}

	return {
		watchHistory: watchHistoryData.map(data => data.watchHistory),
		totalVideos,
		totalPages: Math.ceil(totalVideos / limit),
		currentPage: page,
	}
}

export {
	register,
	login,
	refreshAccessToken,
	logout,
	changePassword,
	updateAvatar,
	updateCoverImage,
	getChannelProfile,
	getWatchHistory,
}
