import { Post } from "../models/Post.js"
import ApiError from "../utils/ApiError.js"

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

export { createPost }
