import ApiError from "../utils/ApiError.js"
import { Video } from "../models/Video.js"
import { Like } from "../models/Like.js"

// helper functions
const getVideoStats = async userId => {
	const videoStats = {
		views: undefined,
		content: undefined,
		totalPublicVideos: undefined,
	}

	try {
		const videos = await Video.find({ owner: userId }).select(
			"views duration isPublished"
		)

		if (!videos || videos.length === 0) {
			return videoStats
		}

		videoStats.views = videos.reduce((acc, video) => acc + video.views, 0)
		videoStats.content = videos.reduce((acc, video) => acc + video.duration, 0)
		videoStats.totalPublicVideos = videos.filter(
			video => video.isPublished
		).length
	} catch (error) {
		console.error("Error in getVideoStats:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}

	return videoStats
}

const getTotalLikes = async userId => {
	try {
		const result = await Video.aggregate([
			{ 
				$match: { owner: userId } 
			},
			{
				$lookup: {
					from: "likes",
					localField: "_id",
					foreignField: "video",
					as: "likes",
				},
			},
			{
				$unwind: "$likes",
			},
			{
				$group: {
					_id: null, // group by all documents into one
					totalLikes: { $sum: 1 }, // Essentially count the number of documents
				}
			},
			{
				$project: {
					_id: 0, // Exclude the _id field
					totalLikes: 1,
				},
			},
		])

		if (!result || result.length === 0) {
			return 0
		}
		
		return result[0].totalLikes
	} catch (error) {
		console.error("Error in getTotalLikes:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const getTotalComments = async userId => {}

const getTotalSubscribers = async userId => {}

const getPublicPlaylist = async userId => {}

// service functions
// Get total views, likes, comments, subscribers, content (in hours),
// public videos, and playlist for a channel
const getChannelStats = async userId => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	try {
		// Initialize channelStats object
		const channelStats = {
			views: undefined,
			likes: undefined,
			comments: undefined,
			subscribers: undefined,
			content: undefined,
			publicVideos: undefined,
			publicPlaylist: undefined,
		}

		// TODO: Implement the logic to get channel stats

		return channelStats
	} catch (error) {
		console.error("Error in getChannelStats:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

export { getChannelStats }
