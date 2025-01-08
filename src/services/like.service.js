import { Like } from "../models/Like.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

const toggleVideoLike = async (videoId, userId) => {
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }
    if (!userId) {
        throw new ApiError(400, "Invalid userId")
    }
    try {
        const like = await Like.findOne({ video: videoId, likedBy: userId })
        if (like) {
            await like.remove()
            return { message: "unlike video" }
        } else {
            await Like.create({ video: videoId, likedBy: userId })
            return { message: "like video" }
        }
    } catch (error) {
        console.error("Failed to toggle video like: ", error)
        throw new ApiError(500, "Internal Server Error")
    }
}

const toggleCommentLike = async (commentId, userId) => {}

const togglePostLike = async (postId, userId) => {}

const getLikedVideos = async userId => {}

export { toggleVideoLike, toggleCommentLike, togglePostLike, getLikedVideos }
