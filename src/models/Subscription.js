import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema(
	{
		subscriber: {
			// user who is subscribing
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		channel: {
			// user who is being subscribed to
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)
