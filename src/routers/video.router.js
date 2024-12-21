import { Router } from "express"
import { upload } from "../middlewares/common/multer.middleware.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	videoDataValidator,
	videoDataValidatorMiddleware,
} from "../middlewares/video/videoDataValidator.middleware.js"
import {
	getAllVideosController,
	getVideoByIdController,
	publishVideoController,
	searchVideosByTitleController,
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

videoRouter.route("/:videoId").get(getVideoByIdController)
videoRouter.route("/search").get(searchVideosByTitleController)

export default videoRouter
