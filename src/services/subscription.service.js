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

    let errorMessage = "Failed to toggle subscription"
    let errorStatusCode = 500
	try {
		let isSubscribed

		const channel = await User.findById(channelId).select("_id")
		if (!channel) {
            errorStatusCode = 404
            errorMessage = "Channel not found"
			throw new ApiError(404, "Channel not found")
		}

        if (channel._id.equals(userId)) {
            errorStatusCode = 400
            errorMessage = "You cannot subscribe to yourself"
            throw new ApiError(400, "You cannot subscribe to yourself")
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
		} else {
			await Subscription.findByIdAndDelete(existingSubscriptions._id)
			isSubscribed = false
		}

		return isSubscribed
	} catch (error) {
		console.error("Failed to toggle subscription", error)
		throw new ApiError(errorStatusCode, errorMessage)
	}
}

export { toggleSubscription }
