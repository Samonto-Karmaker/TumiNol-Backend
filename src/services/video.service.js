// files contains the video file and thumbnail file
const publishVideo = async (userId, title, description, files) => {}

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

module.exports = {
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
