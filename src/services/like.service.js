import { Like } from "../models/Like.js"
import { Video } from "../models/Video.js"
import { Post } from "../models/Post.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

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
        const video = await Video.findById(videoId).select("_id")
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error
        }
        console.error("Failed to find post: ", error)
        throw new ApiError(500, "Internal Server Error")
    }

    return toggleLike({ post: postId }, userId)
}

const getLikedVideos = async userId => {}

export { toggleVideoLike, toggleCommentLike, togglePostLike, getLikedVideos }
