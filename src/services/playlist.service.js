import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Playlist } from "../models/Playlist.js"

const createPlaylist = async (userId, { title, description }) => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	if (!title || !description) {
		throw new ApiError(400, "Title and description are required")
	}
	try {
		const newPlaylist = new Playlist({
			owner: userId,
			title,
			description,
			videos: [],
		})
		await newPlaylist.save()
		return newPlaylist
	} catch (error) {
		console.error("Failed to create playlist:", error);
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const getPlaylistsByOwner = async ownerId => {}

const getPlaylistById = async playlistId => {}

const searchPlaylistsByTitle = async (searchQuery, page, limit) => {}

const updatePlaylistDetails = async (userId, playlistId, playlistDetails) => {}

const addVideoToPlaylist = async (userId, playlistId, videoId) => {}

const removeVideoFromPlaylist = async (userId, playlistId, videoId) => {}

const deletePlaylist = async (userId, playlistId) => {}

const togglePlaylistPrivacy = async (userId, playlistId) => {}

export {
	createPlaylist,
	getPlaylistsByOwner,
	getPlaylistById,
	searchPlaylistsByTitle,
	updatePlaylistDetails,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	togglePlaylistPrivacy,
}
