import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	addComment,
	deleteComment,
	getVideoComments,
	updateComment,
} from "../services/comment.service.js"
import { STANDARD_LIMIT_PER_PAGE } from "../constants.js"

const addCommentController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const userId = req.user._id
	const comment = req.body.comment
	const newComment = await addComment(userId, videoId, comment)
	res.status(201).json(new ApiResponse(201, "Comment added", newComment))
})

const updateCommentController = asyncHandler(async (req, res) => {
	const commentId = req.params.commentId
	const userId = req.user._id
	const newComment = req.body.comment
	const updatedComment = await updateComment(userId, commentId, newComment)
	res.status(200).json(new ApiResponse(200, "Comment updated", updatedComment))
})

const deleteCommentController = asyncHandler(async (req, res) => {
	const commentId = req.params.commentId
	const userId = req.user._id
	await deleteComment(userId, commentId)
	res.status(200).json(new ApiResponse(200, "Comment deleted"))
})

const getVideoCommentsController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	let { page, limit } = req.query
	page = parseInt(page) || 1
	limit = parseInt(limit) || STANDARD_LIMIT_PER_PAGE
	const comments = await getVideoComments(videoId, req.user._id, page, limit)
	res.status(200).json(new ApiResponse(200, "Comments retrieved", comments))
})

export {
	addCommentController,
	updateCommentController,
	deleteCommentController,
	getVideoCommentsController,
}
