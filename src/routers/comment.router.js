import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import { addCommentController } from "../controllers/comment.controllers.js"

const commentRouter = Router()

commentRouter.use(checkAuth)

commentRouter.route("/:videoId").post(addCommentController)

export default commentRouter
