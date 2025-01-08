import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { toggleVideoLike } from "../services/like.service"

const toggleVideoLikeController = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId
    const userId = req.user.id
    const message = await toggleVideoLike(videoId, userId)
    res
        .status(200)
        .json(new ApiResponse(200, message))
})

export { toggleVideoLikeController }