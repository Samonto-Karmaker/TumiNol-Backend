import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Configuring cloudinary with the credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async localFilePath => {
	try {
		if (!localFilePath) return null
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		})
		console.log(`File uploaded successfully: ${response.url}`)
		return response
	} catch (error) {
		return null
	} finally {
		fs.unlink(localFilePath, err => {
			if (err) {
				console.error(err)
			}
		})
	}
}

export { uploadOnCloudinary }
