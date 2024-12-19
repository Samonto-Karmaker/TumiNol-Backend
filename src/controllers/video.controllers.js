import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { publishVideo } from "../services/video.service.js"

const publishVideoController = asyncHandler(async (req, res) => {
	const { title, description } = req.body
	const files = req.files
	const video = await publishVideo(req.user._id, title, description, files)
	res
		.status(201)
		.json(new ApiResponse(201, "Video published successfully", video))
})

const getVideoByIdController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const video = await getVideoById(videoId, req.user._id)
	res
		.status(200)
		.json(new ApiResponse(200, "Video retrieved successfully", video))
})

export { publishVideoController, getVideoByIdController }
