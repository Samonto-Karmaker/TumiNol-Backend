import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import { createPostController } from "../controllers/post.controllers.js"

const postRouter = Router()
postRouter.use(checkAuth)

postRouter.post("/", createPostController)

export default postRouter
