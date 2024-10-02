import { Router } from "express"
import { upload } from "../middlewares/common/multer.middleware.js"
import {
	loginUser,
	logoutUser,
	refreshAccessTokenController,
	registerUser,
} from "../controllers/user.controllers.js"
import {
	registerValidator,
	registerValidatorMiddleware,
} from "../middlewares/user/registerValidator.middleware.js"
import { checkAuth } from "../middlewares/common/authCheck.middleware.js"

const userRouter = Router()

userRouter.post(
	"/register",
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
		{
			name: "coverImage",
			maxCount: 1,
		},
	]),
	registerValidator,
	registerValidatorMiddleware,
	registerUser
)

userRouter.post("/login", loginUser)
userRouter.post("/refresh-token", refreshAccessTokenController)

// Protected routes
userRouter.post("/logout", checkAuth, logoutUser)

export default userRouter
