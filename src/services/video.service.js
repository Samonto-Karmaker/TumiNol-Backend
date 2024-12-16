// videoData: { title, description, videoUrl, thumbnailUrl }
const publishVideo = async (userId, videoData) => {}

// videoDetails: { title, description }
const updateVideoDetails = async (userId, videoId, videoDetails) => {}

const deleteVideo = async (userId, videoId) => {}

const getVideo = async (videoId, accessingUserId) => {}

const getAllVideos = async (sortBy, sortType, page = 1, limit = 10) => {}

const getVideosByUser = async (userId, sortBy, sortType, page = 1, limit = 10) => {}

const searchVideosByTitle = async searchQuery => {}

const togglePublishStatus = async (userId, videoId) => {}

module.exports = {
	publishVideo,
	updateVideoDetails,
	deleteVideo,
	getVideo,
	getAllVideos,
	getVideosByUser,
	searchVideosByTitle,
	togglePublishStatus,
}
