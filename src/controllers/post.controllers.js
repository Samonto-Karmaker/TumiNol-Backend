import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	createPost,
	getPostById,
	getPostByOwnerName,
} from "../services/post.service.js"

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
	const posts = await getPostByOwnerName(ownerName, req.user._id)
	res.json(new ApiResponse(200, "Posts retrieved successfully", posts))
})

export {
	createPostController,
	getPostByIdController,
	getPostByOwnerNameController,
}
