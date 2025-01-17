import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import { addCommentController, updateCommentController } from "../controllers/comment.controllers.js"

const commentRouter = Router()

commentRouter.use(checkAuth)

commentRouter.route("/:videoId").post(addCommentController)
commentRouter.route("/:commentId").patch(updateCommentController)

export default commentRouter
