import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { createPost, getPostById } from "../services/post.service.js"

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

export { createPostController, getPostByIdController }
