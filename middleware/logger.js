import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import * as path from "path";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t ${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.error(error);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t ${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
