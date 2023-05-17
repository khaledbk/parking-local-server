import { Server } from "socket.io";
import chokidar from "chokidar";
import fs from "fs";
import moment from "moment";
import { latestCoordinates } from "./gpsHandler.js";
import { eventsIpAddresses } from "./camEventsHandler.js";
import path from "path";

async function readAndParseJSON(filePath) {
  try {
    const fileData = await fs.readFileSync(filePath, {
      encoding: "utf8",
      flag: "r",
    });
    const parsedData = JSON.parse(fileData);
    return parsedData;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`File '${filePath}' does not exist.`);
    } else if (error.code === "EACCES") {
      console.error(`Permission denied to read file '${filePath}'.`);
    } else if (error.code === "EBUSY") {
      console.error(`File '${filePath}' is locked by another process.`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error parsing JSON file '${filePath}': ${error.message}`);
    } else {
      console.error(`Error processing file '${filePath}': ${error.message}`);
    }

    // Remove the corrupted file

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log('File has been removed');
    });

    // Return an empty object, or handle the error as appropriate for your use case
    return "";
  }
}

export const initIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const watcher = chokidar.watch("./public");

  watcher.on("add", async (filePath) => {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss").toString(),
      `[Action]: listening for changes on this file: ./${filePath}`
    );

    // Give the file some time to be completely written
    setTimeout(async () => {
      try {
        const filename = path.basename(filePath);
        const parsedData = await readAndParseJSON(filePath);
        if (parsedData !== "") {
          const result = {
            status: "UNREAD",
            sentAt: new Date().toLocaleString("en-US", {
              timeZone: "America/Montreal",
            }),
            data: parsedData.result,
            localisation: latestCoordinates,
            ipAddress: eventsIpAddresses[filename],
          };

          // Emit the event and log the message
          io.emit("camEvent", result);
          console.log(
            moment().format("YYYY-MM-DD HH:mm:ss").toString(),
            `Event sent to connected clients. File: ${filePath} Plate Number: ${parsedData.result.anpr.text}`
          );
        } else {
          delete eventsIpAddresses[filename];
        }
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }, 500);
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send the latest coordinates every 2 seconds
    const sendLatestCoordinates = setInterval(() => {
      /*       console.log(
        `GPS: Latitude: ${latestCoordinates.latitude}, Longitude: ${latestCoordinates.longitude}`
      ); */
      io.emit("gpsUpdate", latestCoordinates);
    }, 500);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
