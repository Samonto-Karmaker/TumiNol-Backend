import mongoose from "mongoose"
import { Post } from "../models/Post.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

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
		const postWithMetadata = await Post.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId(postId),
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
				},
			},
			{
				$project: {
					content: 1,
					likeCount: 1,
					isLiked: 1,
					owner: {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
				},
			},
		])

		if (!postWithMetadata || postWithMetadata.length === 0) {
			throw new ApiError(404, "Post not found")
		}

		return postWithMetadata[0]
	} catch (error) {
		console.error("Failed to get post", error)
		throw new ApiError(500, "Failed to get post")
	}
}

const getPostByOwnerId = async (ownerId, accessingUserId) => {
	if (!ownerId || !isValidObjectId(ownerId)) {
		throw new ApiError(400, "A valid owner ID is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user ID is required")
	}

	try {
		const posts = await Post.aggregate([
			{
				$match: {
					owner: mongoose.Types.ObjectId(ownerId),
				}
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
				},
			},
			{
				$project: {
					content: 1,
					likeCount: 1,
					isLiked: 1,
					owner: {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
				},
			},
		])

		if (!posts || posts.length === 0) {
			throw new ApiError(404, "Posts not found")
		}

		return posts
	} catch (error) {
		console.error("Failed to get posts", error)
		throw new ApiError(500, "Failed to get posts")
	}
}

const editPost = async (postId, ownerId, content) => {}

const deletePost = async (postId, ownerId) => {}

export { createPost, getPostById, getPostByOwnerId, editPost, deletePost }
