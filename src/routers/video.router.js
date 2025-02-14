import { Router } from "express"
import { upload } from "../middlewares/common/multer.middleware.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	videoDataValidator,
	videoDataValidatorMiddleware,
} from "../middlewares/video/videoDataValidator.middleware.js"
import {
	deleteVideoController,
	getAllVideosController,
	getVideoByIdController,
	getVideosByOwnerIdController,
	publishVideoController,
	searchVideosByTitleController,
	togglePublishStatusController,
	updateVideoDetailsController,
	updateVideoThumbnailController,
} from "../controllers/video.controllers.js"

const videoRouter = Router()

videoRouter.use(checkAuth)

videoRouter
	.route("/")
	.post(
		upload.fields([
			{
				name: "video",
				maxCount: 1,
			},
			{
				name: "thumbnail",
				maxCount: 1,
			},
		]),
		videoDataValidator,
		videoDataValidatorMiddleware,
		publishVideoController
	)
	.get(getAllVideosController)

videoRouter.route("/search").get(searchVideosByTitleController)
videoRouter.route("/channel/:ownerId").get(getVideosByOwnerIdController)
videoRouter
	.route("/:videoId")
	.get(getVideoByIdController)
	.delete(deleteVideoController)

videoRouter.route("/publish/:videoId").patch(togglePublishStatusController)
videoRouter
	.route("/update-details/:videoId")
	.patch(
		videoDataValidator,
		videoDataValidatorMiddleware,
		updateVideoDetailsController
	)
videoRouter
	.route("/update-thumbnail/:videoId")
	.patch(upload.single("thumbnail"), updateVideoThumbnailController)

export default videoRouter
