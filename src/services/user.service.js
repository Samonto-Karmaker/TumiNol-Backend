import { User } from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

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

	const user = await User.create({
		fullName,
		email,
		userName: userName.toLowerCase(),
		password,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
	})

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	)

	if (!createdUser) {
		throw new ApiError(500, "Failed to create user")
	}

	return createdUser
}

export { register }
