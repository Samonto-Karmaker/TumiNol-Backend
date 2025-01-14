import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { getLikedVideos, togglePostLike, toggleVideoLike } from "../services/like.service.js"
import { STANDARD_LIMIT_PER_PAGE } from "../constants.js"

const toggleVideoLikeController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const userId = req.user._id
	const response = await toggleVideoLike(videoId, userId)
	res.status(200).json(new ApiResponse(200, response.message))
})

const togglePostLikeController = asyncHandler(async (req, res) => {
	const postId = req.params.postId
	const userId = req.user._id
	const response = await togglePostLike(postId, userId)
	res.status(200).json(new ApiResponse(200, response.message))
})

const toggleCommentLikeController = asyncHandler(async (req, res) => {
	const commentId = req.params.commentId
	const userId = req.user._id
	const response = await toggleCommentLike(commentId, userId)
	res.status(200).json(new ApiResponse(200, response.message))
})

const getLikedVideosController = asyncHandler(async (req, res) => {
	const userId = req.user._id
	let { page, limit } = req.query
	page = parseInt(page) || 1
	limit = parseInt(limit) || STANDARD_LIMIT_PER_PAGE
	const likedVideos = await getLikedVideos(userId, page, limit)
	res.status(200).json(new ApiResponse(200, "Liked videos fetched", likedVideos))
})

export {
	toggleVideoLikeController,
	togglePostLikeController,
	toggleCommentLikeController,
	getLikedVideosController,
}
