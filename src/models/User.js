import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: [true, "Username is required"],
			unique: [true, "Username already exists"],
			lowercase: true,
			trim: true,
			index: true,
		},
		fullName: {
			type: String,
			required: [true, "Username is required"],
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: [true, "Email already exists"],
			lowercase: true,
			trim: true,
			index: true,
		},
		avatar: {
			type: String, // CDN link in our case cloudinary link
			required: [true, "Avatar is required"],
		},
		coverImage: {
			type: String, // CDN link in our case cloudinary link
		},
		watchHistory: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

export const User = mongoose.model("User", userSchema)
