import { Router } from "express"
import { upload } from "../middlewares/common/multer.middleware.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	videoDataValidator,
	videoDataValidatorMiddleware,
} from "../middlewares/video/videoDataValidator.middleware.js"
import {
	getVideoByIdController,
	publishVideoController,
} from "../controllers/video.controllers.js"

const videoRouter = Router()

videoRouter.post(
	"/publish",
	checkAuth,
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

videoRouter.route("/:videoId").get(checkAuth, getVideoByIdController)

export default videoRouter
