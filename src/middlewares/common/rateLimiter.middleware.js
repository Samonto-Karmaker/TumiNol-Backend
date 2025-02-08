import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import ApiError from "../../utils/ApiError.js";
import {
    RATE_LIMIT_WINDOW,
    RATE_LIMIT,
    SLOWDOWN_LIMIT,
    SLOWDOWN_INTERVAL,
    SLOWDOWN_DELAY,
} from "../../constants.js";

const rateLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW, // Time window in milliseconds
    max: RATE_LIMIT, // Maximum number of requests per windowMs
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many requests, please try again later"));
    },
});

const speedLimiter = slowDown({
    windowMs: SLOWDOWN_INTERVAL, // Time window in milliseconds
    delayAfter: SLOWDOWN_LIMIT, // Allow requests without delay until this limit is reached
    delayMs: SLOWDOWN_DELAY, // Delay each request by this amount after the limit is reached
});

export { rateLimiter, speedLimiter };