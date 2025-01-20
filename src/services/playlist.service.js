import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Playlist } from "../models/Playlist.js"

const createPlaylist = async (userId, playlistDetails) => {}

const getPlaylistsByOwner = async ownerId => {}

const getPlaylistById = async playlistId => {}

const searchPlaylistsByTitle = async (searchQuery, page, limit) => {}

const updatePlaylistDetails = async (userId, playlistId, playlistDetails) => {}

const addVideoToPlaylist = async (userId, playlistId, videoId) => {}

const removeVideoFromPlaylist = async (userId, playlistId, videoId) => {}

const deletePlaylist = async (userId, playlistId) => {}

export {
	createPlaylist,
	getPlaylistsByOwner,
	getPlaylistById,
	searchPlaylistsByTitle,
	updatePlaylistDetails,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
}
