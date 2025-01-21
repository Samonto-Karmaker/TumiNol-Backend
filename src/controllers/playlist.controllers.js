import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { createPlaylist } from "../services/playlist.service.js"

const createPlaylistController = asyncHandler(async (req, res) => {
	const { title, description } = req.body
	const newPlaylist = await createPlaylist(req.user._id, { title, description })
	res.status(201).json(new ApiResponse(201, "Playlist created", newPlaylist))
})

export { createPlaylistController }
