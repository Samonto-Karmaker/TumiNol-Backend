import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { getChannelStats } from "../services/analytics.service.js"

const getChannelStatsController = asyncHandler(async (req, res) => {
	const userId = req.params.userId
	const channelStats = await getChannelStats(userId)
	res
		.status(200)
		.json(new ApiResponse(200, "Channel stats retrieved", channelStats))
})

export { getChannelStatsController }
