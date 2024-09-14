import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
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
	},
	{
		timestamps: true,
	}
)

export const Post = mongoose.model("Post", postSchema)
