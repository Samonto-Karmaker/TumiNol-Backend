import { Video } from "../models/Video.js";
import ApiError from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

// files contains the video file and thumbnail file
const publishVideo = async (userId, title, description, files) => {
    const videoFilePath = files?.video?.[0]?.path;
    const thumbnailFilePath = files?.thumbnail?.[0]?.path;
    if (!videoFilePath || !thumbnailFilePath) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const videoUpload = await uploadOnCloudinary(videoFilePath, true);
    if (!videoUpload?.url) {
        throw new ApiError(500, "Failed to upload video");
    }

    const duration = videoUpload.duration;
    if (!duration || duration <= 0) {
        throw new ApiError(500, "Failed to get video duration");
    }

    const thumbnailUpload = await uploadOnCloudinary(thumbnailFilePath);
    if (!thumbnailUpload?.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    try {
        const video = await Video.create({
            owner: userId,
            videoFile: videoUpload.url,
            thumbnail: thumbnailUpload.url,
            title,
            description,
            duration,
        });

        const createdVideo = await Video.findById(video._id);
        if (!createdVideo) {
            console.warn(`Video not found with id: ${video._id}`);
            throw new ApiError(404, "Video not found");
        }
        return createdVideo;
    } catch (error) {
        console.error("Failed to publish video", error);
        if (videoUpload) {
            await deleteFromCloudinary(videoUpload.public_id);
        }
        if (thumbnailUpload) {
            await deleteFromCloudinary(thumbnailUpload.public_id);
        }
        throw new ApiError(500, "Failed to publish video");
    }
};

// videoDetails = { title, description }
// if one of the fields is not provided, that field should not be updated
const updateVideoDetails = async (userId, videoId, videoDetails) => {}

const updateVideoThumbnail = async (userId, videoId, thumbnail) => {}

const deleteVideo = async (userId, videoId) => {}

const getVideo = async (videoId, accessingUserId) => {}

const getAllVideos = async (sortBy, sortType, page = 1, limit = 10) => {}

const getVideosByUser = async (userId, sortBy, sortType, page = 1, limit = 10) => {}

const searchVideosByTitle = async searchQuery => {}

const togglePublishStatus = async (userId, videoId) => {}

export {
	publishVideo,
	updateVideoDetails,
	updateVideoThumbnail,
	deleteVideo,
	getVideo,
	getAllVideos,
	getVideosByUser,
	searchVideosByTitle,
	togglePublishStatus,
}
