import fs from "fs"

const deleteUploadedFiles = files => {
	if (!files || Object.keys(files).length === 0) {
		return
	}
	Object.keys(files).forEach(file => {
		fs.unlink(files[file].path, err => {
			if (err) {
				console.error(err)
			}
		})
	})
}

export default deleteUploadedFiles
