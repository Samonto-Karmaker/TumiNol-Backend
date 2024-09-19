import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/temp")
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		const fileName =
			file.originalname.replace(ext, "").toLowerCase().split(" ").join("-") +
			"-" +
			Date.now() +
			ext

		cb(null, fileName)
	},
})

export const upload = multer({
	storage,
})
