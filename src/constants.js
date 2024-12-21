import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMP_DIR = path.join(__dirname, "..", "public", "temp")

const DB_NAME = "tuminol"
const API_URL = "/api/v1"

const VideoSortOptionsEnums = Object.freeze({
    CREATED_AT: "createdAt",
    VIEWS: "views",
    LIKES: "likes",
    DURATION: "duration",
})

const VideoSortOrdersEnums = Object.freeze({
    ASC: "asc",
    DESC: "desc",
})

export { DB_NAME, API_URL, TEMP_DIR, VideoSortOptionsEnums, VideoSortOrdersEnums }
