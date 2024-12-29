import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	publishVideo,
	getVideoById,
	getAllVideos,
	searchVideosByTitle,
	getVideosByOwnerId,
	togglePublishStatus,
	updateVideoDetails,
	updateVideoThumbnail,
	deleteVideo,
} from "../services/video.service.js"
import { VideoSortOptionsEnums, VideoSortOrdersEnums } from "../constants.js"

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

const getAllVideosController = asyncHandler(async (req, res) => {
	let {
		sortBy = VideoSortOptionsEnums.CREATED_AT,
		sortType = VideoSortOrdersEnums.DESC,
		page = 1,
		limit = 10,
	} = req.query
	page = parseInt(page)
	limit = parseInt(limit)
	const videos = await getAllVideos(sortBy, sortType, page, limit)
	res
		.status(200)
		.json(new ApiResponse(200, "Videos retrieved successfully", videos))
})

const searchVideosByTitleController = asyncHandler(async (req, res) => {
	let {
		searchQuery,
		sortBy = VideoSortOptionsEnums.CREATED_AT,
		sortType = VideoSortOrdersEnums.DESC,
		page = 1,
		limit = 10,
	} = req.query
	page = parseInt(page)
	limit = parseInt(limit)
	const videos = await searchVideosByTitle(
		searchQuery,
		sortBy,
		sortType,
		page,
		limit
	)
	res
		.status(200)
		.json(new ApiResponse(200, "Videos retrieved successfully", videos))
})

const getVideosByOwnerIdController = asyncHandler(async (req, res) => {
	const ownerId = req.params.ownerId
	const accessingUserId = req.user._id
	const videos = await getVideosByOwnerId(ownerId, accessingUserId)

	res
		.status(200)
		.json(new ApiResponse(200, "Videos retrieved successfully", videos))
})

const togglePublishStatusController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const video = await togglePublishStatus(req.user._id, videoId)
	res
		.status(200)
		.json(new ApiResponse(200, "Video publish status toggled", video))
})

const updateVideoDetailsController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const updatedDetails = req.body
	const video = await updateVideoDetails(req.user._id, videoId, updatedDetails)
	res
		.status(200)
		.json(new ApiResponse(200, "Video details updated successfully", video))
})

const updateVideoThumbnailController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const thumbnail = req.file
	const video = await updateVideoThumbnail(req.user._id, videoId, thumbnail)
	res
		.status(200)
		.json(new ApiResponse(200, "Video thumbnail updated successfully", video))
})

const deleteVideoController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	await deleteVideo(req.user._id, videoId)
	res.status(204).json(new ApiResponse(204, "Video deleted successfully"))
})

export {
	publishVideoController,
	getVideoByIdController,
	getAllVideosController,
	searchVideosByTitleController,
	getVideosByOwnerIdController,
	togglePublishStatusController,
	updateVideoDetailsController,
	updateVideoThumbnailController,
	deleteVideoController,
}
