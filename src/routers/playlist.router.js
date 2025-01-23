import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	playlistDetailsValidator,
	playlistDetailsValidatorMiddleware,
} from "../middlewares/playlist/playlistDetailsValidator.middleware.js"
import {
	addVideoToPlaylistController,
	createPlaylistController,
	getPlaylistsByOwnerIdController,
	removeVideoFromPlaylistController,
} from "../controllers/playlist.controllers.js"

const playlistRouter = Router()

playlistRouter.use(checkAuth)

playlistRouter.post(
	"/",
	playlistDetailsValidator,
	playlistDetailsValidatorMiddleware,
	createPlaylistController
)

playlistRouter.get("/channel/:ownerId", getPlaylistsByOwnerIdController)

playlistRouter
	.route("/video/:playlistId")
	.post(addVideoToPlaylistController)
	.patch(removeVideoFromPlaylistController)

export default playlistRouter
