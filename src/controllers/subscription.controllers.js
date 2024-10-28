import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
	toggleSubscription,
	getSubscriberList,
	getSubscribedChannels,
} from "../services/subscription.service.js"

const toggleSubscriptionController = asyncHandler(async (req, res) => {
	const { channelId } = req.params
	const isSubscribed = await toggleSubscription(channelId, req.user._id)
	isSubscribed
		? res.status(201).json(new ApiResponse(201, "Subscribed successfully"))
		: res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"))
})

const getSubscriberListController = asyncHandler(async (req, res) => {
	const subscriberList = await getSubscriberList(req.user._id)
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				"Subscriber list retrieved successfully",
				subscriberList
			)
		)
})

const getSubscribedChannelsController = asyncHandler(async (req, res) => {
	const subscribedChannels = await getSubscribedChannels(req.user._id)
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				"Subscribed channels retrieved successfully",
				subscribedChannels
			)
		)
})

export { toggleSubscriptionController, getSubscriberListController, getSubscribedChannelsController }
