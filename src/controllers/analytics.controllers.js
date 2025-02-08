import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	getChannelStats,
	getTopPerformingVideos,
	getTopPosts,
} from "../services/analytics.service.js"

const getChannelStatsController = asyncHandler(async (req, res) => {
	const userId = req.params.userId
	const channelStats = await getChannelStats(userId)
	res
		.status(200)
		.json(new ApiResponse(200, "Channel stats retrieved", channelStats))
})

const getTopPerformingVideosController = asyncHandler(async (req, res) => {
	const userId = req.user._id
	const topVideos = await getTopPerformingVideos(userId)
	res
		.status(200)
		.json(new ApiResponse(200, "Top performing videos fetched", topVideos))
})

const getTopPostsController = asyncHandler(async (req, res) => {
	const userId = req.user._id
	const topPosts = await getTopPosts(userId)
	res.status(200).json(new ApiResponse(200, "Top posts fetched", topPosts))
})

export {
	getChannelStatsController,
	getTopPerformingVideosController,
	getTopPostsController,
}
