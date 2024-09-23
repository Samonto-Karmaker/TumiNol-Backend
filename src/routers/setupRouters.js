import testRouter from "./test.router.js"
import userRouter from "./user.router.js"
import { API_URL } from "../constants.js"

const setupRouters = app => {
	app.use(`${API_URL}/test`, testRouter)
	app.use(`${API_URL}/users`, userRouter)
}

export default setupRouters
