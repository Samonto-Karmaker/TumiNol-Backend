import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMP_DIR = path.join(__dirname, "..", "public", "temp")

const DB_NAME = "tuminol"
const API_URL = "/api/v1"

export { DB_NAME, API_URL, TEMP_DIR }
