import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import setupRouters from "./routers/setupRouters.js"
import errorHandler from "./middlewares/common/error.middleware.js"

const app = express()

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
)
app.use(
	express.json({
		limit: "50mb",
	})
)
app.use(
	express.urlencoded({
		limit: "50mb",
		extended: true,
	})
)
app.use(express.static("public"))
app.use(cookieParser())

setupRouters(app)
app.use(errorHandler)

export default app
