import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	createPlaylist,
	getPlaylistsByOwner,
} from "../services/playlist.service.js"
import { STANDARD_LIMIT_PER_PAGE } from "../constants.js"

const createPlaylistController = asyncHandler(async (req, res) => {
	const { title, description } = req.body
	const newPlaylist = await createPlaylist(req.user._id, { title, description })
	res.status(201).json(new ApiResponse(201, "Playlist created", newPlaylist))
})

const getPlaylistsByOwnerController = asyncHandler(async (req, res) => {
	let { page, limit } = req.query
	page = parseInt(page) || 1
	limit = parseInt(limit) || STANDARD_LIMIT_PER_PAGE
	const ownerId = req.params.ownerId
	const playlists = await getPlaylistsByOwner(ownerId, page, limit)
	res.status(200).json(new ApiResponse(200, "Playlists fetched", playlists))
})

export { createPlaylistController, getPlaylistsByOwnerController }
