import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/handlers/cameras/index.js";
import { pingmanHandler } from "./src/handlers/ping/index.js";
import { heartbeatHandler } from "./src/handlers/heartbeat/index.js";
import fs from "fs";
import path from "path";
import { camEventsHandler } from "./src/handlers/camEvents/index.js";
import localIpAddress from "local-ip-address";

const PORT = 3002;
const directory = "public";

export const app = express();

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

// fs.writeFile(
//   "./log.txt",
//   `${moment()
//     .format("YYYY-MM-DD HH:mm:ss")
//     .toString()}: ========= server started ========= \n`,
//   { flag: "a+" },
//   (err) => {
//     if (err) {
//       console.error(err);
//     }
//     // file written successfully
//   }
// );

app.use(bodyParser({ limit: "50mb" }));

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/cameras", eventsHandler);

app.get("/heartbeat", heartbeatHandler);

app.post("/cam-events", camEventsHandler);

app.post("/ping", pingmanHandler);

app.listen(PORT, () => {
  console.log(
    "========================================= Starting =========================================="
  );
  console.log(
    `\n \n`,
    "🚀 . . . .  Cam-Server is running on ",
    localIpAddress(),
    ":",
    PORT,
    `\n \n`
  );
});
