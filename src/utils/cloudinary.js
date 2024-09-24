import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { TEMP_DIR } from "../constants.js"

dotenv.config()

// Configuring cloudinary with the credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async localFilePath => {
	try {
		if (!localFilePath) return null
		console.log(`Uploading file: ${localFilePath}`)
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		})
		console.log(`File uploaded successfully: ${response.url}`)
		return response
	} catch (error) {
		console.error(error)
		return null
	} finally {
		fs.unlink(localFilePath, err => {
			if (err) {
				console.error(err)
			}
		})
	}
}

const deleteFromCloudinary = async publicId => {
	try {
		if (!publicId) return null
		console.log(`Deleting file: ${publicId}`)
		const response = await cloudinary.uploader.destroy(publicId)
		console.log(`File deleted successfully: ${response.result}`)
	} catch (error) {
		console.log("Error deleting file from cloudinary")
		console.error(error)
	}
}

export { uploadOnCloudinary, deleteFromCloudinary }
