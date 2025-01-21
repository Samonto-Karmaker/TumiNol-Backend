import { Router } from "express"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"
import {
	playlistDetailsValidator,
	playlistDetailsValidatorMiddleware,
} from "../middlewares/playlist/playlistDetailsValidator.middleware.js"
import { createPlaylistController } from "../controllers/playlist.controllers.js"

const playlistRouter = Router()

playlistRouter.post(
	"/",
	checkAuth,
	playlistDetailsValidator,
	playlistDetailsValidatorMiddleware,
	createPlaylistController
)

export default playlistRouter
