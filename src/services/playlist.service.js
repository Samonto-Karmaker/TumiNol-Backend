import { isValidObjectId } from "../utils/validateObjectId.js"
import ApiError from "../utils/ApiError.js"
import { Playlist } from "../models/Playlist.js"
import {
	STANDARD_LIMIT_PER_PAGE,
	HIGHEST_LIMIT_PER_PAGE,
} from "../constants.js"
import PaginationResponseDTO from "../DTOs/PaginationResponseDTO.js"
import { User } from "../models/User.js"
import { Video } from "../models/Video.js"

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

const getPlaylistsByOwnerId = async (
	ownerId,
	accessingUserId,
	page = 1,
	limit = STANDARD_LIMIT_PER_PAGE
) => {
	if (!ownerId || !isValidObjectId(ownerId)) {
		throw new ApiError(400, "Invalid ownerId")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Invalid accessingUserId")
	}
	if (page < 1 || limit < 1 || limit > HIGHEST_LIMIT_PER_PAGE) {
		throw new ApiError(400, "Invalid page or limit")
	}
	try {
		const owner = await User.findById(ownerId).select("_id")
		if (!owner) {
			throw new ApiError(404, "Owner not found")
		}

		const constraints = {
			owner: owner._id,
		}
		if (owner._id.toString() !== accessingUserId.toString()) {
			constraints.isPublic = true
		}
		const totalPlaylists = await Playlist.countDocuments(constraints)
		const totalPages = Math.ceil(totalPlaylists / limit)
		if (totalPlaylists === 0) {
			return new PaginationResponseDTO([], totalPlaylists, totalPages, 0)
		}
		if (page > totalPages) {
			throw new ApiError(400, "Invalid page value")
		}

		const playlists = await Playlist.aggregate([
			{
				$match: constraints,
			},
			{
				$lookup: {
					from: "users",
					localField: "owner",
					foreignField: "_id",
					as: "owner",
				},
			},
			{
				$unwind: "$owner",
			},
			{
				$lookup: {
					from: "videos",
					localField: "videos",
					foreignField: "_id",
					as: "videos",
				},
			},
			{
				$unwind: {
					path: "$videos",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					$or: [{ "videos.isPublished": true }, { videos: { $exists: false } }],
				},
			},
			{
				$group: {
					_id: "$_id",
					videos: { $push: "$videos" },
					title: { $first: "$title" },
					description: { $first: "$description" },
					owner: { $first: "$owner" },
					createdAt: { $first: "$createdAt" },
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					description: 1,
					owner: {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
					videos: {
						_id: 1,
						title: 1,
						thumbnail: 1,
					},
					createdAt: 1,
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$skip: (page - 1) * limit,
			},
			{
				$limit: limit,
			},
		])

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

const addVideoToPlaylist = async (userId, playlistId, videoId) => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	if (!playlistId || !isValidObjectId(playlistId)) {
		throw new ApiError(400, "Invalid playlistId")
	}
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "Invalid videoId")
	}
	try {
		const playlist = await Playlist.findById(playlistId)
		if (!playlist) {
			throw new ApiError(404, "Playlist not found")
		}
		if (playlist.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "Forbidden")
		}
		const video = await Video.findById(videoId).select("_id isPublished")
		if (!video) {
			throw new ApiError(404, "Video not found")
		}
		if (!video.isPublished) {
			throw new ApiError(400, "Video is not published")
		}
		if (playlist.videos.includes(video._id)) {
			throw new ApiError(400, "Video already in playlist")
		}
		playlist.videos.push(video._id)
		await playlist.save()
		return playlist
	} catch (error) {
		console.error("Failed to add video to playlist:", error)
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(500, "Internal Server Error")
	}
}

const removeVideoFromPlaylist = async (userId, playlistId, videoId) => {}

const deletePlaylist = async (userId, playlistId) => {}

const togglePlaylistPrivacy = async (userId, playlistId) => {}

export {
	createPlaylist,
	getPlaylistsByOwnerId,
	getPlaylistById,
	searchPlaylistsByTitle,
	updatePlaylistDetails,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	togglePlaylistPrivacy,
}
