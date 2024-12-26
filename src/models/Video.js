import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import { Like } from "./Like.js"
import { Comment } from "./Comment.js"
import { User } from "./User.js"
import { Playlist } from "./Playlist.js"

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

// Cascade delete likes, comments, watchHistory, and playlist videos when a video is deleted
videoSchema.pre("findOneAndDelete", async function (next) {
	const videoId = this.getQuery()["_id"]
	Promise.all([
		Like.deleteMany({ video: videoId }),
		Comment.deleteMany({ video: videoId }),
		User.updateMany(
			{ watchHistory: videoId },
			{ $pull: { watchHistory: videoId } }
		),
		Playlist.updateMany({ videos: videoId }, { $pull: { videos: videoId } }),
	])
	next()
})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)
