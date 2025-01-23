import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	addVideoToPlaylist,
	createPlaylist,
	deletePlaylist,
	getPlaylistsByOwnerId,
	removeVideoFromPlaylist,
	togglePlaylistPrivacy,
} from "../services/playlist.service.js"
import { STANDARD_LIMIT_PER_PAGE } from "../constants.js"

const createPlaylistController = asyncHandler(async (req, res) => {
	const { title, description } = req.body
	const newPlaylist = await createPlaylist(req.user._id, { title, description })
	res.status(201).json(new ApiResponse(201, "Playlist created", newPlaylist))
})

const getPlaylistsByOwnerIdController = asyncHandler(async (req, res) => {
	let { page, limit } = req.query
	page = parseInt(page) || 1
	limit = parseInt(limit) || STANDARD_LIMIT_PER_PAGE
	const ownerId = req.params.ownerId
	const playlists = await getPlaylistsByOwnerId(
		ownerId,
		req.user._id,
		page,
		limit
	)
	res.status(200).json(new ApiResponse(200, "Playlists fetched", playlists))
})

const addVideoToPlaylistController = asyncHandler(async (req, res) => {
	const { videoId } = req.body
	const { playlistId } = req.params
	const userId = req.user._id
	const playlist = await addVideoToPlaylist(userId, playlistId, videoId)
	res
		.status(200)
		.json(new ApiResponse(200, "Video added to playlist", playlist))
})

const removeVideoFromPlaylistController = asyncHandler(async (req, res) => {
	const { videoId } = req.body
	const { playlistId } = req.params
	const userId = req.user._id
	const playlist = await removeVideoFromPlaylist(userId, playlistId, videoId)
	res
		.status(200)
		.json(new ApiResponse(200, "Video removed from playlist", playlist))
})

const togglePlaylistPrivacyController = asyncHandler(async (req, res) => {
	const { playlistId } = req.params
	const userId = req.user._id
	const privacy = await togglePlaylistPrivacy(userId, playlistId)
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				privacy ? "Playlist is now public" : "Playlist is now private"
			)
		)
})

const deletePlaylistController = asyncHandler(async (req, res) => {
	const { playlistId } = req.params
	const userId = req.user._id
	await deletePlaylist(userId, playlistId)
	res.status(200).json(new ApiResponse(200, "Playlist deleted"))
})

export {
	createPlaylistController,
	getPlaylistsByOwnerIdController,
	addVideoToPlaylistController,
	removeVideoFromPlaylistController,
	togglePlaylistPrivacyController,
	deletePlaylistController,
}
