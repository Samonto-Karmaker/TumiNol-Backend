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

const updateComment = async (commentId, comment) => {}

const deleteComment = async commentId => {}

export { getVideoComments, addComment, updateComment, deleteComment }
