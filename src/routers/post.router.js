import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	createPostController,
	deletePostController,
	editPostController,
	getPostByIdController,
	getPostByOwnerNameController,
} from "../controllers/post.controllers.js"

const postRouter = Router()
postRouter.use(checkAuth)

postRouter.post("/", createPostController)
postRouter.get("/:postId", getPostByIdController)
postRouter.get("/user/:ownerName/:page/:limit", getPostByOwnerNameController)
postRouter.patch("/:postId", editPostController)
postRouter.delete("/:postId", deletePostController)

export default postRouter
