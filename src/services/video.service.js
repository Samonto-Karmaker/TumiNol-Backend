import mongoose, { get, mongo } from "mongoose"
import { Video } from "../models/Video.js"
import ApiError from "../utils/ApiError.js"
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from "../utils/cloudinary.js"
import { isValidObjectId } from "../utils/validateObjectId.js"
import { VideoSortOptionsEnums, VideoSortOrdersEnums } from "../constants.js"
import { User } from "../models/User.js"
import { extractPublicId } from "cloudinary-build-url"

// Helper functions
const getVideoAggregate = (match, sortBy, sortType, page, limit) => [
	{
		$match: match,
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
			from: "likes",
			localField: "_id",
			foreignField: "video",
			as: "likes",
		},
	},
	{
		$addFields: {
			likeCount: { $size: "$likes" },
		},
	},
	{
		$project: {
			owner: {
				_id: 1,
				fullName: 1,
				avatar: 1,
			},
			thumbnail: 1,
			title: 1,
			duration: 1,
			views: 1,
			likeCount: 1,
			createdAt: 1,
		},
	},
	{
		$sort: {
			[sortBy]: sortType === VideoSortOrdersEnums.ASC ? 1 : -1,
		},
	},
	{
		$skip: (page - 1) * limit,
	},
	{
		$limit: limit,
	},
]

// files contains the video file and thumbnail file
const publishVideo = async (userId, title, description, files) => {
	const videoFilePath = files?.video?.[0]?.path
	const thumbnailFilePath = files?.thumbnail?.[0]?.path
	if (!videoFilePath || !thumbnailFilePath) {
		throw new ApiError(400, "Video file and thumbnail are required")
	}

	const videoUpload = await uploadOnCloudinary(videoFilePath, true)
	if (!videoUpload?.url) {
		throw new ApiError(500, "Failed to upload video")
	}

	const duration = videoUpload.duration
	if (!duration || duration <= 0) {
		throw new ApiError(500, "Failed to get video duration")
	}

	const thumbnailUpload = await uploadOnCloudinary(thumbnailFilePath)
	if (!thumbnailUpload?.url) {
		throw new ApiError(500, "Failed to upload thumbnail")
	}

	try {
		const video = await Video.create({
			owner: userId,
			videoFile: videoUpload.url,
			thumbnail: thumbnailUpload.url,
			title,
			description,
			duration,
		})

		const createdVideo = await Video.findById(video._id)
		if (!createdVideo) {
			console.warn(`Video not found with id: ${video._id}`)
			throw new ApiError(404, "Video not found")
		}
		return createdVideo
	} catch (error) {
		console.error("Failed to publish video", error)
		if (videoUpload) {
			await deleteFromCloudinary(videoUpload.public_id)
		}
		if (thumbnailUpload) {
			await deleteFromCloudinary(thumbnailUpload.public_id)
		}
		throw new ApiError(500, "Failed to publish video")
	}
}

// videoDetails = { title, description }
// if one of the fields is not provided, that field should not be updated
const updateVideoDetails = async (userId, videoId, videoDetails) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "A valid video ID is required")
	}
	if (!videoDetails || Object.keys(videoDetails).length === 0) {
		throw new ApiError(400, "Video details are required")
	}

	try {
		const video = await Video.findById(videoId)
		if (!video) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}
		if (video.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not allowed to update this video")
		}

		const updatedFields = {}
		if (videoDetails.title?.trim() !== "") {
			updatedFields.title = videoDetails.title
		}
		if (videoDetails.description?.trim() !== "") {
			updatedFields.description = videoDetails.description
		}
		if (Object.keys(updatedFields).length === 0) {
			throw new ApiError(400, "No valid fields to update")
		}

		const updatedVideo = await Video.findByIdAndUpdate(
			videoId,
			{
				$set: updatedFields,
			},
			{
				new: true,
				runValidators: true,
			}
		).select("_id title description")

		if (!updatedVideo) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}

		return updatedVideo
	} catch (error) {
		console.error("Failed to update video details", error)
		throw new ApiError(500, "Failed to update video details")
	}
}

const updateVideoThumbnail = async (userId, videoId, file) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "A valid video ID is required")
	}

	// As this is a single file upload, file is the thumbnail file
	const thumbnailFilePath = file?.path
	if (!thumbnailFilePath) {
		throw new ApiError(400, "Thumbnail file is required")
	}

	const thumbnail = await uploadOnCloudinary(thumbnailFilePath)
	if (!thumbnail?.url) {
		throw new ApiError(500, "Failed to upload thumbnail")
	}

	try {
		const video = await Video.findById(videoId)
		if (!video) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}
		if (video.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not allowed to update this video")
		}

		const oldThumbnailPublicId = extractPublicId(video.thumbnail)

		const updatedVideo = await Video.findByIdAndUpdate(
			videoId,
			{
				$set: { thumbnail: thumbnail.url },
			},
			{
				new: true,
				runValidators: true,
			}
		).select("_id thumbnail")

		if (!updatedVideo) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}

		if (oldThumbnailPublicId) {
			await deleteFromCloudinary(oldThumbnailPublicId)
		}

		return updatedVideo
	} catch (error) {
		console.error("Failed to update video thumbnail", error)
		throw new ApiError(500, "Failed to update video thumbnail")
	}
}

const deleteVideo = async (userId, videoId) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "A valid video ID is required")
	}

	try {
		const video = await Video.findById(videoId)
		if (!video) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}
		if (video.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not allowed to delete this video")
		}

		const videoPublicId = extractPublicId(video.videoFile)
		const thumbnailPublicId = extractPublicId(video.thumbnail)
		await Promise.all([
			Video.findByIdAndDelete(videoId),
			deleteFromCloudinary(videoPublicId, "video"),
			deleteFromCloudinary(thumbnailPublicId),
		])

		console.log(`Video deleted with id: ${videoId}`)
	} catch (error) {
		console.error("Failed to delete video", error)
		throw new ApiError(500, "Failed to delete video")
	}
}

const getVideoById = async (videoId, accessingUserId) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "A valid video ID is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user ID is required")
	}

	let videoWithMetaData
	try {
		videoWithMetaData = await Video.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(videoId),
					isPublished: true,
				},
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
					from: "likes",
					localField: "_id",
					foreignField: "video",
					as: "likes",
				},
			},
			{
				$addFields: {
					likeCount: { $size: "$likes" },
					isLiked: {
						$in: [accessingUserId, "$likes.likedBy"],
					},
				},
			},
			{
				$project: {
					owner: {
						_id: 1,
						fullName: 1,
						avatar: 1,
					},
					videoFile: 1,
					thumbnail: 1,
					title: 1,
					description: 1,
					duration: 1,
					views: 1,
					likeCount: 1,
					isLiked: 1,
					createdAt: 1,
				},
			},
		])
	} catch (error) {
		console.error("Failed to get video by id", error)
		throw new ApiError(500, "Failed to get video by id")
	}

	if (!videoWithMetaData || videoWithMetaData.length === 0) {
		console.warn(`Video not found with id: ${videoId}`)
		throw new ApiError(404, "Video not found")
	}

	try {
		await Promise.all([
			Video.updateOne({ _id: videoId }, { $inc: { views: 1 } }),
			User.updateOne(
				{ _id: accessingUserId },
				{ $addToSet: { watchHistory: videoId } }
			),
		])
	} catch (error) {
		console.error("Failed to update video views", error)
		throw new ApiError(500, "Failed to update video views")
	}

	return videoWithMetaData[0]
}

const getAllVideos = async (
	sortBy = VideoSortOptionsEnums.CREATED_AT,
	sortType = VideoSortOrdersEnums.DESC,
	page = 1,
	limit = 10
) => {
	if (!Object.values(VideoSortOptionsEnums).includes(sortBy)) {
		throw new ApiError(400, "Invalid sort by option")
	}

	if (!Object.values(VideoSortOrdersEnums).includes(sortType)) {
		throw new ApiError(400, "Invalid sort type option")
	}

	const constrains = {
		isPublished: true,
	}

	try {
		const totalVideos = await Video.countDocuments(constrains)
		const videos = await Video.aggregate(
			getVideoAggregate(constrains, sortBy, sortType, page, limit)
		)

		return {
			videos,
			totalVideos,
			totalPages: Math.ceil(totalVideos / limit),
			currentPage: page,
		}
	} catch (error) {
		console.error("Failed to get all videos", error)
		throw new ApiError(500, "Failed to get all videos")
	}
}

/* 	
	ownerId is the user ID of the owner of the videos
	accessingUserId is the user ID of the user accessing the videos
	if accessingUserId is the same as ownerId, return all videos
	else return only published videos
*/
const getVideosByOwnerId = async (
	ownerId,
	accessingUserId,
	sortBy = VideoSortOptionsEnums.CREATED_AT,
	sortType = VideoSortOrdersEnums.DESC,
	page = 1,
	limit = 10
) => {
	if (!ownerId || !isValidObjectId(ownerId)) {
		throw new ApiError(400, "A valid owner ID is required")
	}
	if (!accessingUserId) {
		throw new ApiError(400, "Accessing user ID is required")
	}
	if (!Object.values(VideoSortOptionsEnums).includes(sortBy)) {
		throw new ApiError(400, "Invalid sort by option")
	}
	if (!Object.values(VideoSortOrdersEnums).includes(sortType)) {
		throw new ApiError(400, "Invalid sort type option")
	}

	try {
		const owner = await User.findById(ownerId).select("_id")
		if (!owner) {
			console.warn(`User not found with id: ${ownerId}`)
			throw new ApiError(404, "User not found")
		}

		const constrains = {
			owner: owner._id,
		}
		if (owner._id.toString() !== accessingUserId.toString()) {
			constrains.isPublished = true
		}

		const totalVideos = await Video.countDocuments(constrains)
		const videos = await Video.aggregate(
			getVideoAggregate(constrains, sortBy, sortType, page, limit)
		)

		return {
			videos,
			totalVideos,
			totalPages: Math.ceil(totalVideos / limit),
			currentPage: page,
		}
	} catch (error) {
		console.error("Failed to get videos by user", error)
		throw new ApiError(500, "Failed to get videos by user")
	}
}

const searchVideosByTitle = async (
	searchQuery,
	sortBy = VideoSortOptionsEnums.CREATED_AT,
	sortType = VideoSortOrdersEnums.DESC,
	page = 1,
	limit = 10
) => {
	if (!searchQuery) {
		throw new ApiError(400, "Search query is required")
	}
	if (!Object.values(VideoSortOptionsEnums).includes(sortBy)) {
		throw new ApiError(400, "Invalid sort by option")
	}
	if (!Object.values(VideoSortOrdersEnums).includes(sortType)) {
		throw new ApiError(400, "Invalid sort type option")
	}

	const constrains = {
		isPublished: true,
		title: { $regex: searchQuery, $options: "i" },
	}

	try {
		const totalVideos = await Video.countDocuments(constrains)
		const videos = await Video.aggregate(
			getVideoAggregate(constrains, sortBy, sortType, page, limit)
		)

		return {
			videos,
			totalVideos,
			totalPages: Math.ceil(totalVideos / limit),
			currentPage: page,
		}
	} catch (error) {
		console.error("Failed to search videos by title", error)
		throw new ApiError(500, "Failed to search videos by title")
	}
}

const togglePublishStatus = async (userId, videoId) => {
	if (!videoId || !isValidObjectId(videoId)) {
		throw new ApiError(400, "A valid video ID is required")
	}

	try {
		const video = await Video.findById(videoId)
		if (!video) {
			console.warn(`Video not found with id: ${videoId}`)
			throw new ApiError(404, "Video not found")
		}

		if (video.owner.toString() !== userId.toString()) {
			throw new ApiError(403, "You are not allowed to update this video")
		}

		video.isPublished = !video.isPublished
		await video.save()
		return {
			_id: video._id,
			isPublished: video.isPublished,
		}
	} catch (error) {
		console.error("Failed to toggle publish status", error)
		throw new ApiError(500, "Failed to toggle publish status")
	}
}

export {
	publishVideo,
	updateVideoDetails,
	updateVideoThumbnail,
	deleteVideo,
	getVideoById,
	getAllVideos,
	getVideosByOwnerId,
	searchVideosByTitle,
	togglePublishStatus,
}
