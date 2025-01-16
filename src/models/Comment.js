import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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

// Cascade delete likes when a comment is deleted
commentSchema.pre("findOneAndDelete", async function (next) {
	const commentId = this.getQuery()["_id"]
	await mongoose.model("Like").deleteMany({ comment: commentId })
	next()
})

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)
