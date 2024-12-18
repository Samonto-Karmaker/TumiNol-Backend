import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

// Configuring cloudinary with the credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath, isVideo = false) => {
	try {
		if (!localFilePath) return null
		console.log(`Uploading file: ${localFilePath}`)
		const options = {
			resource_type: isVideo ? "video" : "auto",
		}

		/* 	If the file is a video, we will add the eager option to generate a m3u8 file
			Eager transformation is used to generate and store transformed versions of the image or video during the upload process
			This allows you to perform complex manipulations on the uploaded media before delivery
			Here, we are generating different streaming profiles for the video for Adaptive Bitrate Streaming (ABR)
		 	format: "m3u8" is used to generate a m3u8 file which is used for streaming videos in HTTP Live Streaming (HLS) format
		*/
		if (isVideo) {
			options.eager = [
				{ streaming_profile: "sd", format: "m3u8" }, // sd: standard definition for low bandwidth
				{ streaming_profile: "hd", format: "m3u8" }, // hd: high definition for medium bandwidth
				{ streaming_profile: "full_hd", format: "m3u8" }, // full_hd: full high definition for high bandwidth
			]
		}
		/*
			The code does work and different streaming profiles are generated for the video
			However, I don't see the generated m3u8 files in the Cloudinary dashboard but
			the response object contains the generated m3u8 files
			Now I don't know what to do with the generated m3u8 files, how to store them, and
			what to do with them in the frontend
			For now, I will just log the generated m3u8 files in the console and store the URL of the video
			TODO: Find out how to store and use the generated m3u8 files in the frontend
		*/
		const response = await cloudinary.uploader.upload(localFilePath, options)
		console.log(`File uploaded successfully: ${response.url}`)
		if (isVideo) {
			console.log("Generated m3u8 files:")
			console.log(response.eager)
			console.log(`playback_url: ${response.playback_url}`)
		}
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
