import dotenv from "dotenv";
dotenv.config();

import express from "express";
import * as path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import { connectDB } from "./config/dbConn.js";

import { logger, logEvents } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { router as root } from "./routes/root.js";
import { router as userRoute } from "./routes/userRouter.js";
import { router as jobRoute } from "./routes/jobRouter.js";
import { router as authRoute } from "./routes/authRouter.js";

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
//logger middleware
app.use(logger);
app.use(cors(corsOptions));
// static middleware
app.use("/", express.static(path.join(__dirname, "public")));
// JSON middleware
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

//Routes
app.use("/", root);
app.use("/users", userRoute);
app.use("/jobs", jobRoute);
app.use("/auth", authRoute);

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t ${err.syscall}\t${err.hostname}`,
    "mongoErrlog.log"
  );
});
