import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"

const createPlaylistController = asyncHandler(async (req, res) => {
	const { title, description } = req.body
	const newPlaylist = await createPlaylist(req.user._id, { title, description })
	res.status(201).json(new ApiResponse(201, newPlaylist))
})

export { createPlaylistController }
