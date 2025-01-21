import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Playlist } from "../models/Playlist.js"
import {
	STANDARD_LIMIT_PER_PAGE,
	HIGHEST_LIMIT_PER_PAGE,
} from "../constants.js"
import PaginationResponseDTO from "../DTOs/PaginationResponseDTO.js"
import { User } from "../models/User.js"

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
		console.error("Failed to create playlist:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const getPlaylistsByOwner = async (
	ownerId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!ownerId || isValidObjectId(ownerId)) {
		throw new ApiError(400, "Invalid ownerId")
	}
	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit")
	}
	try {
		const owner = await User.findById(ownerId).select("_id")
		if (!owner) {
			throw new ApiError(404, "Owner not found")
		}
		const totalPlaylists = await Playlist.countDocuments({ owner: ownerId })
		const totalPages = Math.ceil(totalPlaylists / limit)
		if (totalPlaylists === 0) {
			return new PaginationResponseDTO([], totalPlaylists, totalPages, 0)
		}
		if (page > totalPages) {
			throw new ApiError(400, "Invalid page value")
		}
		const playlists = await Playlist.find({ owner: ownerId })
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ createdAt: -1 })
			.populate("owner", "_id avatar fullName")
			.populate("videos", "_id title thumbnail")

		return new PaginationResponseDTO(
			playlists,
			totalPlaylists,
			totalPages,
			page
		)
	} catch (error) {
		console.error("Failed to get playlists by owner:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

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
