import { Server } from "socket.io";
import chokidar from "chokidar";
import fs from "fs";
import moment from "moment";

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
        const fileData = await fs.promises.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(fileData);

        const result = {
          status: "UNREAD",
          sentAt: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
          data: parsedData.result,
        };

        // Emit the event and log the message
        io.emit("camEvent", result);
        console.log(
          moment().format("YYYY-MM-DD HH:mm:ss").toString(),
          `Event sent to connected clients. File: ${filePath}`
        );
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }, 500);
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
