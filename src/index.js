import express from "express";
import cors from "cors";
import { camEventsHandler } from "./handlers/camEventsHandler.js";
import { heartbeatHandler } from "./handlers/heartbeatHandler.js";
import { pingmanHandler } from "./handlers/pingmanHandler.js";
import { startGpsParser } from "./handlers/gpsHandler.js";

import localIpAddress from "local-ip-address";
import fs from "fs";
import path from "path";
import http from "http";
import { initIo } from "./handlers/socketHandler.js";

const PORT = 3002;
const directory = "public";

const app = express();
const server = http.createServer(app);
initIo(server);
startGpsParser();

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/heartbeat", heartbeatHandler);
app.post("/cam-events", camEventsHandler);
app.post("/ping", pingmanHandler);

server.listen(PORT, () => {
  console.log("========================================= Starting ==========================================");
  console.log("🚀 . . . .  Cam-Server is running on ", localIpAddress(), ":", PORT);
});
