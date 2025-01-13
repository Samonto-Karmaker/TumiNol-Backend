import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	createPost,
	deletePost,
	editPost,
	getPostById,
	getPostByOwnerName,
} from "../services/post.service.js"
import { STANDARD_LIMIT_PER_PAGE } from "../constants.js"

const createPostController = asyncHandler(async (req, res) => {
	const { content } = req.body
	const post = await createPost(req.user._id, content)
	res.status(201).json(new ApiResponse(201, "Post created successfully", post))
})

const getPostByIdController = asyncHandler(async (req, res) => {
	const { postId } = req.params
	const post = await getPostById(postId, req.user._id)
	res.json(new ApiResponse(200, "Post retrieved successfully", post))
})

const getPostByOwnerNameController = asyncHandler(async (req, res) => {
	const { ownerName } = req.params
	let { page = 1, limit = STANDARD_LIMIT_PER_PAGE } = req.query
	page = parseInt(page) || 1
	limit = parseInt(limit) || STANDARD_LIMIT_PER_PAGE
	const posts = await getPostByOwnerName(ownerName, req.user._id, page, limit)
	res.json(new ApiResponse(200, "Posts retrieved successfully", posts))
})

const editPostController = asyncHandler(async (req, res) => {
	const { postId } = req.params
	const { content } = req.body
	const post = await editPost(postId, req.user._id, content)
	res.json(new ApiResponse(200, "Post edited successfully", post))
})

const deletePostController = asyncHandler(async (req, res) => {
	const { postId } = req.params
	await deletePost(postId, req.user._id)
	res.json(new ApiResponse(200, "Post deleted successfully"))
})

export {
	createPostController,
	getPostByIdController,
	getPostByOwnerNameController,
	editPostController,
	deletePostController,
}
