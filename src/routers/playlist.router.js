import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	playlistDetailsValidator,
	playlistDetailsValidatorMiddleware,
} from "../middlewares/playlist/playlistDetailsValidator.middleware.js"
import {
	addVideoToPlaylistController,
	createPlaylistController,
	deletePlaylistController,
	getPlaylistsByOwnerIdController,
	removeVideoFromPlaylistController,
	togglePlaylistPrivacyController,
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

playlistRouter.patch("/privacy/:playlistId", togglePlaylistPrivacyController)

playlistRouter.route("/:playlistId").delete(deletePlaylistController)

export default playlistRouter
