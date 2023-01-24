import { rateLimit } from "express-rate-limit";
import { logEvents } from "./logger.js";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per "window" per minute
  message: {
    message:
      "Too many login attempts from this IP please try again after 60 seconds",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "error.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, //return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
