import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
	try {
		await mongoose.connect(
			`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`
		)
		console.log("MongoDB connection succeeded!")
	} catch (error) {
		console.log("MongoDB connection failed", error)
		process.exit(1)
	}
}

export default connectDB
