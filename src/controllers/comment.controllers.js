import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { addComment, updateComment } from "../services/comment.service.js"

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

export { addCommentController, updateCommentController }
