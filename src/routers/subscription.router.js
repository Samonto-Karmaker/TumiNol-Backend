import { Router } from "express";
import { toggleSubscriptionController } from "../controllers/subscription.controllers.js";
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"

const subscriptionRouter = Router()

subscriptionRouter.use(checkAuth)
subscriptionRouter.route("/channel/:channelId").post(toggleSubscriptionController)

export default subscriptionRouter