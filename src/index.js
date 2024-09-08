//External imports
import dotenv from "dotenv"

// Internal imports
import app from "./app.js"
import connectDB from "./db/setupDB.js"

dotenv.config({
	path: "./.env",
})

const PORT = process.env.PORT || 3001

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	})
	.catch(err => {
		console.log("Error connecting to the database", err)
	})
