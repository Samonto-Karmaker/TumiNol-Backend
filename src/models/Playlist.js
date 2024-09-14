import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		videos: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Video",
			},
		],
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
	},
	{
		timestamps: true,
	}
)

export const Playlist = mongoose.model("Playlist", playlistSchema)
