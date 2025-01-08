import { Like } from "../models/Like.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

// Helper functions
const toggleLike = async (resourceObject, userId) => {
    try {
        const like = await Like.findOne({ ...resourceObject, likedBy: userId })
        if (like) {
            await like.remove()
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
    return toggleLike({ video: videoId }, userId)
}

const toggleCommentLike = async (commentId, userId) => {}

const togglePostLike = async (postId, userId) => {}

const getLikedVideos = async userId => {}

export { toggleVideoLike, toggleCommentLike, togglePostLike, getLikedVideos }
