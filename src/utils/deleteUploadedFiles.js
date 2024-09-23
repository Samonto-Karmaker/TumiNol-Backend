import fs from "fs"
import path from "path"
import { TEMP_DIR } from "../constants.js"

const deleteUploadedFiles = files => {
	if (!files || Object.keys(files).length === 0) {
		return
	}
	Object.keys(files).forEach(file => {
		const filePath = path.join(TEMP_DIR, files[file].path)
		fs.unlink(filePath, err => {
			if (err) {
				console.error(err)
			}
		})
	})
}

export default deleteUploadedFiles
