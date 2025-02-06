import ApiError from "../utils/ApiError.js"
import { Video } from "../models/Video.js"
import { User } from "../models/User.js"
import { Playlist } from "../models/Playlist.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

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

		// Calculate total content duration in seconds rounded to the nearest second
		videoStats.content = Math.round(
			videos.reduce((acc, video) => acc + video.duration, 0)
		)
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
				$match: { owner: userId },
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
				},
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

const getTotalComments = async userId => {
	try {
		const result = await Video.aggregate([
			{
				$match: {
					owner: userId,
				},
			},
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "video",
					as: "comments",
				},
			},
			{
				$unwind: "$comments",
			},
			{
				$group: {
					_id: null,
					totalComments: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					totalComments: 1,
				},
			},
		])

		if (!result || result.length === 0) {
			return 0
		}

		return result[0].totalComments
	} catch (error) {
		console.error("Error in getTotalComments:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const getTotalSubscribers = async userId => {
	try {
		const result = await User.aggregate([
			{
				$match: {
					_id: userId,
				},
			},
			{
				$lookup: {
					from: "subscriptions",
					localField: "_id",
					foreignField: "channel",
					as: "subscribers",
				},
			},
			// As there is only one user, we can use $addFields instead of $unwind
			{
				$addFields: {
					totalSubscribers: { $size: "$subscribers" },
				},
			},
			{
				$project: {
					_id: 0,
					totalSubscribers: 1,
				},
			},
		])

		if (!result || result.length === 0) {
			return 0
		}

		return result[0].totalSubscribers
	} catch (error) {
		console.error("Error in getTotalSubscribers:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const getPublicPlaylist = async userId => {
	try {
		const result = await Playlist.find({
			owner: userId,
			isPublic: true,
		}).countDocuments()
		return result
	} catch (error) {
		console.error("Error in getPublicPlaylist:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

// service functions
// Get total views, likes, comments, subscribers, content (in seconds for now),
// public videos, and playlist for a channel
const getChannelStats = async userId => {
	if (!userId || !isValidObjectId(userId)) {
		throw new ApiError(400, "A valid userId is required")
	}
	try {
		const user = await User.findById(userId).select("_id")
		if (!user) {
			throw new ApiError(404, "User not found")
		}

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

		const videoStats = await getVideoStats(user._id)
		channelStats.views = videoStats.views
		channelStats.content = videoStats.content
		channelStats.publicVideos = videoStats.totalPublicVideos

		const results = await Promise.allSettled([
			getTotalLikes(user._id),
			getTotalComments(user._id),
			getTotalSubscribers(user._id),
			getPublicPlaylist(user._id),
		])

		results.forEach((result, index) => {
			if (result.status === "fulfilled") {
				switch (index) {
					case 0:
						channelStats.likes = result.value
						break
					case 1:
						channelStats.comments = result.value
						break
					case 2:
						channelStats.subscribers = result.value
						break
					case 3:
						channelStats.publicPlaylist = result.value
						break
					default:
						break
				}
			} else {
				console.error("Error in getChannelStats:", result.reason)
			}
		})

		return channelStats
	} catch (error) {
		console.error("Error in getChannelStats:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

// here userId comes from req.user.id not from req.params.userId
// Only visible to the channel owner
const getTopPerformingVideos = async userId => {
	if (!userId) {
		throw new ApiError(400, "A valid userId is required")
	}
	try {
		const user = await User.findById(userId).select("_id")
		if (!user) {
			throw new ApiError(404, "User not found")
		}

		const videos = await Video.aggregate([
			{
				$match: {
					owner: user._id,
				},
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
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "video",
					as: "comments",
				},
			},
			{
				$addFields: {
					likesCount: { $size: "$likes" },
					commentsCount: { $size: "$comments" },
				},
			},
			{
				$sort: {
					views: -1,
					likesCount: -1,
					commentsCount: -1,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					thumbnail: 1,
					views: 1,
					likesCount: 1,
					commentsCount: 1,
				},
			},
			{
				$limit: 5,
			},
		])

		return videos
	} catch (error) {
		console.error("Error in topPerformingVideos:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

export { getChannelStats }
