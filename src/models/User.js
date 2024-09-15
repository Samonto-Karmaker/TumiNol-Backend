import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

// Never use arrow function in mongoose schema because arrow function does not bind "this"
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next()

	this.password = await bcrypt.hash(this.password, 10)
	next()
})

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

// Access tokens are short-lived tokens that are used to authenticate the user and
// are required for every request.
userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: ACCESS_TOKEN_EXPIRES_IN,
		}
	)
}

// Refresh tokens are long-lived tokens that are used to generate new access tokens
// once they expire.
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		}
	)
}

export const User = mongoose.model("User", userSchema)
