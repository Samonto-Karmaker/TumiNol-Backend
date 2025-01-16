import { API_URL } from "../constants.js"
import testRouter from "./test.router.js"
import userRouter from "./user.router.js"
import subscriptionRouter from "./subscription.router.js"
import postRouter from "./post.router.js"
import videoRouter from "./video.router.js"
import likeRouter from "./like.router.js"
import commentRouter from "./comment.router.js"

const setupRouters = app => {
	app.use(`${API_URL}/test`, testRouter)
	app.use(`${API_URL}/users`, userRouter)
	app.use(`${API_URL}/subscriptions`, subscriptionRouter)
	app.use(`${API_URL}/posts`, postRouter)
	app.use(`${API_URL}/videos`, videoRouter)
	app.use(`${API_URL}/likes`, likeRouter)
	app.use(`${API_URL}/comments`, commentRouter)
}

export default setupRouters
