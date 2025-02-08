import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import setupRouters from "./routers/setupRouters.js"
import errorHandler from "./middlewares/common/error.middleware.js"
import {
	rateLimiter,
	speedLimiter,
} from "./middlewares/common/rateLimiter.middleware.js"

const app = express()

// Apply CORS middleware
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
)

// Apply rate-limiting middlewares globally
app.use(speedLimiter)
app.use(rateLimiter)

// Apply body parsing middleware
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

// Serve static files
app.use(express.static("public"))

// Apply cookie parsing middleware
app.use(cookieParser(process.env.COOKIE_SECRET))

// Setup routers
setupRouters(app)

// Apply error handling middleware
app.use(errorHandler)

export default app
