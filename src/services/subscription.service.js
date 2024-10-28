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

const getSubscriberList = async userId => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	try {
		const subscriberList = await Subscription.aggregate([
			{
				$match: {
					channel: userId,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "subscriber",
					foreignField: "_id",
					as: "subscriberList",
				},
			},
			{
				$unwind: "$subscriberList",
			},
			{
				$project: {
					_id: "$subscriberList._id",
					userName: "$subscriberList.userName",
					avatar: "$subscriberList.avatar",
				},
			},
		])

		return subscriberList
	} catch (error) {
		console.error("Failed to get subscriber list", error)
		throw new ApiError(500, "Failed to get subscriber list")
	}
}

const getSubscribedChannels = async userId => {
	if (!userId) {
		throw new ApiError(400, "User ID is required")
	}
	try {
		const subscribedChannels = await Subscription.aggregate([
			{
				$match: {
					subscriber: userId,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "channel",
					foreignField: "_id",
					as: "channelList",
				},
			},
			{
				$unwind: "$channelList",
			},
			{
				$project: {
					_id: "$channelList._id",
					userName: "$channelList.userName",
					avatar: "$channelList.avatar",
				},
			},
		])

		return subscribedChannels
	} catch (error) {
		console.error("Failed to get subscribed channels", error)
		throw new ApiError(500, "Failed to get subscribed channels")
	}
}

export { toggleSubscription, getSubscriberList, getSubscribedChannels }
