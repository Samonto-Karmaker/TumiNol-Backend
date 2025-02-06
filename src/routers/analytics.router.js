import { Router } from "express"
import {
	getChannelStatsController,
	getTopPerformingVideosController,
} from "../controllers/analytics.controllers.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"

const analyticsRouter = Router()

analyticsRouter.get("/channel-stats/:userId", getChannelStatsController)
analyticsRouter.get("/top-videos", checkAuth, getTopPerformingVideosController)

export default analyticsRouter
