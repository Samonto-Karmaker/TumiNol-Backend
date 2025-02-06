import { Router } from "express"
import { getChannelStatsController } from "../controllers/analytics.controllers.js"

const analyticsRouter = Router()

analyticsRouter.get("/channel-stats/:userId", getChannelStatsController)

export default analyticsRouter
