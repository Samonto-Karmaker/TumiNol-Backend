import mongoose from "mongoose"
import { Like } from "./Like.js"

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

// Cascade delete likes when a post is deleted
postSchema.pre("findOneAndDelete", async function (next) {
	const postId = this.getQuery()["_id"]
	await Like.deleteMany({ post: postId })
	next()
})

export const Post = mongoose.model("Post", postSchema)
