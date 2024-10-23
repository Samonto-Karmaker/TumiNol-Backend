import { Subscription } from "../models/Subscription.js"
import { User } from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import { isValidObjectId } from "../utils/validateObjectId.js"

// Service functions
const toggleSubscription = async (channelId, userId) => {
    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "A valid channel ID is required")
    }
    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }
    if (channelId === userId) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    try {
        let isSubscribed

        const channel = await User.findById(channelId).select("_id")
        if (!channel) {
            throw new ApiError(404, "Channel not found")
        }

        const existingSubscriptions = await Subscription.findOne({
            subscriber: userId,
            channel: channelId,
        })
        if (!existingSubscriptions) {
            await Subscription.create({
                subscriber: userId,
                channel: channelId,
            })
            isSubscribed = true
        }
        else {
            await Subscription.findByIdAndDelete(existingSubscriptions._id)
            isSubscribed = false
        }

        return isSubscribed
    } catch (error) {
        console.error("Failed to toggle subscription", error)
        throw new ApiError(500, "Failed to toggle subscription")
    }
}

export {
    toggleSubscription
}