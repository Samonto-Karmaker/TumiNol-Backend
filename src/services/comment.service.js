import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Video } from "../models/Video.js"
import { Comment } from "../models/Comment.js"

const getVideoComments = async videoId => {}

const addComment = async (userId, videoId, comment) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "Invalid video ID")
	}
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	if (!comment || !comment.trim()) {
		throw new ApiError(400, "Comment is required")
	}
	if (comment.length > 200) {
		throw new ApiError(400, "Comment is too long")
	}

	try {
		const video = await Video.findById(videoId).select("_id isPublished")
		if (!video || !video.isPublished) {
			throw new ApiError(404, "Video not found")
		}

		const newComment = new Comment({
			owner: userId,
			video: videoId,
			content: comment,
		})

		await newComment.save()
		return newComment
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, error.message)
	}
}

const updateComment = async (userId, commentId, newComment) => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	if (!commentId || !isValidObjectId(commentId)) {
		throw new ApiError(400, "Invalid comment ID")
	}
	if (!newComment || !newComment.trim()) {
		throw new ApiError(400, "Comment is required")
	}
	if (newComment.length > 200) {
		throw new ApiError(400, "Comment is too long")
	}
	try {
		const comment = await Comment.findById(commentId).select("owner")
		if (!comment) {
			throw new ApiError(404, "Comment not found")
		}
		if (comment.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not authorized to update this comment")
		}
		const updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{
				$set: { content: newComment },
			},
			{ new: true }
		)

		return updatedComment
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Failed to update comment")
	}
}

const deleteComment = async (userId, commentId) => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	if (!commentId || !isValidObjectId(commentId)) {
		throw new ApiError(400, "Invalid comment ID")
	}
	try {
		const comment = await Comment.findById(commentId).select("owner")
		if (!comment) {
			throw new ApiError(404, "Comment not found")
		}
		if (comment.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not authorized to delete this comment")
		}
		await Comment.findByIdAndDelete(commentId)
		return true
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Failed to delete comment")
	}
}

export { getVideoComments, addComment, updateComment, deleteComment }
