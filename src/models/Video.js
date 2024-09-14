import mongoose from "mongoose"

const videoSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		videoFile: {
			type: String, // CDN link in our case cloudinary link
			required: [true, "Video file is required"],
		},
		thumbnail: {
			type: String, // CDN link in our case cloudinary link
			required: [true, "Thumbnail is required"],
		},
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			index: true,
		},
		description: {
			type: String,
			required: [true, "description is required"],
			trim: true,
		},
		duration: {
			type: Number,
			required: [true, "Duration is required"],
		},
		views: {
			type: Number,
			default: 0,
			min: [0, "Views can't be negative"],
		},
		isPublished: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)

export const Video = mongoose.model("Video", videoSchema)
