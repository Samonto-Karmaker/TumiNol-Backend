import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	togglePostLikeController,
	toggleVideoLikeController,
} from "../controllers/like.controllers.js"

const likeRouter = Router()
likeRouter.use(checkAuth)

likeRouter.post("/video/:videoId", toggleVideoLikeController)
likeRouter.post("/post/:postId", togglePostLikeController)

export default likeRouter
