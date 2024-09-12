import testRouter from "./test.router.js"
import { API_URL } from "../constants.js"

const setupRouters = app => {
	app.use(`${API_URL}/test`, testRouter)
}

export default setupRouters
