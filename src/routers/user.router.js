import { Router } from "express"
import { upload } from "../middlewares/common/multer.middleware.js"
import { registerUser } from "../controllers/user.controllers.js"
import {
	registerValidator,
	registerValidatorMiddleware,
} from "../middlewares/user/registerValidator.middleware.js"

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

export default userRouter
