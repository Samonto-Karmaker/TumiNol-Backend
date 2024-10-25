import testRouter from "./test.router.js"
import userRouter from "./user.router.js"
import { API_URL } from "../constants.js"
import subscriptionRouter from "./subscription.router.js"

const setupRouters = app => {
	app.use(`${API_URL}/test`, testRouter)
	app.use(`${API_URL}/users`, userRouter)
	app.use(`${API_URL}/subscriptions`, subscriptionRouter)
}

export default setupRouters
