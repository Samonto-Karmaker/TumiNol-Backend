import { Router } from "express"
import { healthChecker } from "../controllers/test.controllers.js"

const router = Router()

// router.route("/").get(healthChecker)

router.get("/", healthChecker)

export default router
