import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import { toggleSubscription } from "../services/subscription.service.js"

const toggleSubscriptionController = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const isSubscribed = await toggleSubscription(channelId, req.user._id)
    isSubscribed ? 
        res
            .status(201)
            .json(new ApiResponse(201, "Subscribed successfully")) :
        res
            .status(200)
            .json(new ApiResponse(200, "Unsubscribed successfully"))
})