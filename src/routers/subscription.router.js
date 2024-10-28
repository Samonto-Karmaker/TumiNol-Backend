import { Router } from "express"
import {
	toggleSubscriptionController,
	getSubscriberListController,
    getSubscribedChannelsController,
} from "../controllers/subscription.controllers.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"

const subscriptionRouter = Router()

subscriptionRouter.use(checkAuth)

subscriptionRouter.route("/subscribers").get(getSubscriberListController)
subscriptionRouter.route("/subscribed").get(getSubscribedChannelsController)
subscriptionRouter
	.route("/channel/:channelId")
	.post(toggleSubscriptionController)

export default subscriptionRouter
