import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import { createPostController, getPostByIdController } from "../controllers/post.controllers.js"

const postRouter = Router()
postRouter.use(checkAuth)

postRouter.post("/", createPostController)
postRouter.get("/:postId", getPostByIdController)

export default postRouter
