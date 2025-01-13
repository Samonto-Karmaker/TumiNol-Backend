import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import { toggleVideoLikeController } from "../controllers/like.controllers.js"

const likeRouter = Router()
likeRouter.use(checkAuth)

likeRouter.post("/video/:videoId", toggleVideoLikeController)

export default likeRouter
