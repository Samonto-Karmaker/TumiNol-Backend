import { Like } from "../models/Like.js"
import { Video } from "../models/Video.js"
import { Post } from "../models/Post.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"
import {
	STANDARD_LIMIT_PER_PAGE,
	HIGHEST_LIMIT_PER_PAGE,
} from "../constants.js"
import PaginationResponseDTO from "../db/DTOs/PaginationResponseDTO.js"

// Helper functions
const toggleLike = async (resourceObject, userId) => {
	try {
		const like = await Like.findOne({ ...resourceObject, likedBy: userId })
		if (like) {
			await Like.findByIdAndDelete(like._id)
			return { message: "unlike" }
		} else {
			await Like.create({ ...resourceObject, likedBy: userId })
			return { message: "like" }
		}
	} catch (error) {
		console.error("Failed to toggle like: ", error)
		throw new ApiError(500, "Internal Server Error")
	}
}

// Service functions
const toggleVideoLike = async (videoId, userId) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "Invalid videoId")
	}
	if (!userId) {
		throw new ApiError(400, "Invalid userId")
	}

	try {
		const video = await Video.findById(videoId).select("_id isPublished")
		if (!video || !video.isPublished) {
			throw new ApiError(404, "Video not found")
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to find video: ", error)
		throw new ApiError(500, "Internal Server Error")
	}

	return toggleLike({ video: videoId }, userId)
}

const toggleCommentLike = async (commentId, userId) => {
	if (!commentId || !isValidObjectId(commentId)) {
		throw new ApiError(400, "Invalid commentId")
	}
	if (!userId) {
		throw new ApiError(400, "Invalid userId")
	}

	try {
		const comment = await Comment.findById(commentId).select("_id")
		if (!comment) {
			throw new ApiError(404, "Comment not found")
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to find comment: ", error)
		throw new ApiError(500, "Internal Server Error")
	}

	return toggleLike({ comment: commentId }, userId)
}

const togglePostLike = async (postId, userId) => {
	if (!postId || !isValidObjectId(postId)) {
		throw new ApiError(400, "Invalid postId")
	}
	if (!userId) {
		throw new ApiError(400, "Invalid userId")
	}

	try {
		const post = await Post.findById(postId).select("_id")
		if (!post) {
			throw new ApiError(404, "Post not found")
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to find post: ", error)
		throw new ApiError(500, "Internal Server Error")
	}

	return toggleLike({ post: postId }, userId)
}

const getLikedVideos = async (
	userId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!userId) {
		throw new ApiError(400, "Invalid userId")
	}
	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit")
	}

	try {
		const totalLikedVideos = await Like.countDocuments({
			likedBy: userId,
			video: { $exists: true },
		})
		const totalPages = Math.ceil(totalLikedVideos / limit)
		if (totalLikedVideos === 0) {
			return new PaginationResponseDTO([], totalLikedVideos, totalPages, 0)
		}
		if (page > totalPages) {
			throw new ApiError(400, "Invalid page")
		}

		const likedVideos = await Like.aggregate([
			{
				$match: {
					likedBy: userId,
					video: { $exists: true },
				},
			},
			{
				$lookup: {
					from: "videos",
					localField: "video",
					foreignField: "_id",
					as: "video",
				},
			},
			{
				$unwind: "$video",
			},
			{
				$match: {
					"video.isPublished": true,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "video.owner",
					foreignField: "_id",
					as: "video.owner",
				},
			},
			{
				$unwind: "$video.owner",
			},
			{
				$lookup: {
					from: "likes",
					localField: "video._id",
					foreignField: "video",
					as: "video.likes",
				},
			},
			{
				$addFields: {
					"video.likeCount": { $size: "$video.likes" },
				},
			},
			{
				$project: {
					"video._id": 1,
					"video.title": 1,
					"video.thumbnail": 1,
					"video.views": 1,
					"video.duration": 1,
					"video.createdAt": 1,
					"video.owner": {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
					"video.likeCount": 1,
					"createdAt": 1,
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$skip: (page - 1) * limit,
			},
			{
				$limit: limit,
			},
		])

		return new PaginationResponseDTO(
			likedVideos,
			totalLikedVideos,
			totalPages,
			page
		)
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to count liked videos: ", error)
		throw new ApiError(500, "Internal Server Error")
	}
}

export { toggleVideoLike, toggleCommentLike, togglePostLike, getLikedVideos }
