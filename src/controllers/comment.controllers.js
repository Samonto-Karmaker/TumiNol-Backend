import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { addComment } from "../services/comment.service.js"

const addCommentController = asyncHandler(async (req, res) => {
	const videoId = req.params.videoId
	const userId = req.user._id
	const comment = req.body.comment
	const newComment = await addComment(userId, videoId, comment)
	res.status(201).json(new ApiResponse(201, "Comment added", newComment))
})

export { addCommentController }
