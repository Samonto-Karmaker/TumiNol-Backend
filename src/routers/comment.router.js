import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	addCommentController,
	deleteCommentController,
	getVideoCommentsController,
	updateCommentController,
} from "../controllers/comment.controllers.js"

const commentRouter = Router()

commentRouter.use(checkAuth)

commentRouter
	.route("/:videoId")
	.post(addCommentController)
	.get(getVideoCommentsController)
commentRouter
	.route("/:commentId")
	.patch(updateCommentController)
	.delete(deleteCommentController)

export default commentRouter
