import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		content: {
			type: String,
			required: [true, "Content is required"],
			trim: true,
		},
		video: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Video",
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export const Comment = mongoose.model("Comment", commentSchema)
