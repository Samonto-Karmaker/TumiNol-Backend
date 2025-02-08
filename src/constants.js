import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMP_DIR = path.join(__dirname, "..", "public", "temp")

const DB_NAME = "tuminol"
const API_URL = "/api/v1"
const HIGHEST_LIMIT_PER_PAGE = 50
const STANDARD_LIMIT_PER_PAGE = 10

const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT = 10
const SLOWDOWN_LIMIT = 5
const SLOWDOWN_INTERVAL = 60 * 1000 // 1 minute
const SLOWDOWN_DELAY = 1000 // 1 second

const VideoSortOptionsEnums = Object.freeze({
	CREATED_AT: "createdAt",
	VIEWS: "views",
	LIKES: "likeCount",
	DURATION: "duration",
})

const VideoSortOrdersEnums = Object.freeze({
	ASC: "asc",
	DESC: "desc",
})

export {
	DB_NAME,
	API_URL,
	HIGHEST_LIMIT_PER_PAGE,
	STANDARD_LIMIT_PER_PAGE,
	TEMP_DIR,
	VideoSortOptionsEnums,
	VideoSortOrdersEnums,
	RATE_LIMIT_WINDOW,
	RATE_LIMIT,
	SLOWDOWN_LIMIT,
	SLOWDOWN_INTERVAL,
	SLOWDOWN_DELAY,
}
