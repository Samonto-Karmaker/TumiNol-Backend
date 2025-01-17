import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Video } from "../models/Video.js"
import { Comment } from "../models/Comment.js"
import {
	STANDARD_LIMIT_PER_PAGE,
	HIGHEST_LIMIT_PER_PAGE,
} from "../constants.js"
import PaginationResponseDTO from "../DTOs/PaginationResponseDTO.js"

const getVideoComments = async (
	videoId,
	accessingUserId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "Invalid video ID")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "User ID is required")
	}
	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit")
	}
	try {
		const video = await Video.findById(videoId).select("_id isPublished")
		if (!video || !video.isPublished) {
			throw new ApiError(404, "Video not found")
		}
		const totalComments = await Comment.countDocuments({ video: videoId })
		const totalPages = Math.ceil(totalComments / limit)
		if (page > totalPages) {
			throw new ApiError(404, "No comments found")
		}
		if (totalComments === 0) {
			return new PaginationResponseDTO([], totalComments, totalPages, 0)
		}

		const comments = await Comment.aggregate([
			{
				$match: { video: videoId },
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "owner",
				},
			},
			{
				$unwind: "$owner",
			},
			{
				$lookup: {
					from: "likes",
					localField: "_id",
					foreignField: "comment",
					as: "likes",
				},
			},
			{
				$addFields: {
					likeCount: { $size: "$likes" },
					isLiked: {
						$in: [accessingUserId, "$likes.owner"],
					},
				},
			},
			{
				$project: {
					content: 1,
					createdAt: 1,
					likeCount: 1,
					isLiked: 1,
					owner: {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
				},
			},
			{
				$sort: { createAt: -1 },
			},
			{
				$skip: (page - 1) * limit,
			},
			{
				$limit: limit,
			},
		])

		return new PaginationResponseDTO(comments, totalComments, totalPages, page)
	} catch (error) {
		console.error("Failed to get comments: ", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, error.message)
	}
}

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
		console.error("Failed to add comment: ", error)
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
		console.error("Failed to update comment: ", error)
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
		console.error("Failed to delete comment: ", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Failed to delete comment")
	}
}

export { getVideoComments, addComment, updateComment, deleteComment }
