import mongoose from "mongoose"
import { Post } from "../models/Post.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"
import { User } from "../models/User.js"
import {
	HIGHEST_LIMIT_PER_PAGE,
	STANDARD_LIMIT_PER_PAGE,
} from "../constants.js"

// Helper functions
const getPostAggregate = (match, accessingUserId) => [
	{
		$match: {
			$or: [
				{ _id: new mongoose.Types.ObjectId(match) },
				{ owner: new mongoose.Types.ObjectId(match) },
			],
		},
	},
	{
		$sort: {
			createdAt: -1,
		},
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
			foreignField: "post",
			as: "likes",
		},
	},
	{
		$addFields: {
			likeCount: { $size: "$likes" },
			isLiked: {
				$in: [accessingUserId, "$likes.likedBy"],
			},
			isEdited: {
				$cond: {
					if: { $ne: ["$createdAt", "$updatedAt"] },
					then: true,
					else: false,
				},
			},
		},
	},
	{
		$project: {
			content: 1,
			likeCount: 1,
			isLiked: 1,
			isEdited: 1,
			owner: {
				_id: 1,
				fullName: 1,
				avatar: 1,
			},
		},
	},
]

// Service functions
const createPost = async (ownerId, content) => {
	if (!ownerId) {
		throw new ApiError(400, "Owner ID is required")
	}
	if (!content || content.trim() === "") {
		throw new ApiError(400, "Content is required")
	}
	if (content.length > 500) {
		throw new ApiError(400, "Content is too long")
	}

	try {
		return await Post.create({
			owner: ownerId,
			content,
		})
	} catch (error) {
		console.error("Failed to create post", error)
		throw new ApiError(500, "Failed to create post")
	}
}

// Get post content along with owner Full Name, Avatar, and number of likes
const getPostById = async (postId, accessingUserId) => {
	if (!postId || !isValidObjectId(postId)) {
		throw new ApiError(400, "A valid post ID is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user ID is required")
	}

	try {
		const postWithMetadata = await Post.aggregate(
			getPostAggregate(postId, accessingUserId)
		)

		if (!postWithMetadata || postWithMetadata.length === 0) {
			throw new ApiError(404, "Post not found")
		}

		return postWithMetadata[0]
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to get post", error)
		throw new ApiError(500, "Failed to get post")
	}
}

const getPostByOwnerName = async (
	ownerName,
	accessingUserId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!ownerName) {
		throw new ApiError(400, "A valid owner ID is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user ID is required")
	}
	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit value")
	}

	try {
		const owner = await User.findOne({ userName: ownerName }).select("_id")
		if (!owner) {
			throw new ApiError(404, "Owner not found")
		}

		const totalPosts = await Post.countDocuments({ owner: owner._id })
		if (totalPosts === 0) {
			return {
				posts: [],
				totalPosts: 0,
				totalPages: 0,
				currentPage: page,
			}
		}
		
		const totalPages = Math.ceil(totalPosts / limit)
		if (page > totalPages) {
			throw new ApiError(400, "Invalid page value")
		}

		const posts = await Post.aggregate([
			...getPostAggregate(owner._id, accessingUserId),
			{
				$skip: (page - 1) * limit,
			},
			{
				$limit: limit,
			},
		])

		return {
			posts,
			totalPosts,
			totalPages,
			currentPage: page,
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to get posts", error)
		throw new ApiError(500, "Failed to get posts")
	}
}

const editPost = async (postId, ownerId, content) => {
	if (!postId || !isValidObjectId(postId)) {
		throw new ApiError(400, "A valid post ID is required")
	}
	if (!ownerId) {
		throw new ApiError(400, "Owner ID is required")
	}
	if (!content || content.trim() === "") {
		throw new ApiError(400, "Content is required")
	}
	if (content.length > 500) {
		throw new ApiError(400, "Content is too long")
	}

	try {
		const post = await Post.findById(postId)
		if (!post) {
			throw new ApiError(404, "Post not found")
		}
		if (post.owner.toString() !== ownerId.toString()) {
			throw new ApiError(403, "You are not authorized to edit this post")
		}
		post.content = content
		return await post.save()
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to edit post", error)
		throw new ApiError(500, "Failed to edit post")
	}
}

const deletePost = async (postId, ownerId) => {
	if (!postId || !isValidObjectId(postId)) {
		throw new ApiError(400, "A valid post ID is required")
	}
	if (!ownerId) {
		throw new ApiError(400, "Owner ID is required")
	}

	try {
		const post = await Post.findById(postId)
		if (!post) {
			throw new ApiError(404, "Post not found")
		}
		if (post.owner.toString() !== ownerId.toString()) {
			throw new ApiError(403, "You are not authorized to delete this post")
		}
		await Post.findByIdAndDelete(post._id)
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		console.error("Failed to delete post", error)
		throw new ApiError(500, "Failed to delete post")
	}
}

export { createPost, getPostById, getPostByOwnerName, editPost, deletePost }
