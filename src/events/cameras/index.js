import fs from "fs";
import moment from "moment";
import chokidar from "chokidar";
import carsImg from "./sampleCars.js";

let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let numbers = "0123456789";

const generateImmat = () =>
  characters.charAt(Math.floor(Math.random() * characters.length)) +
  numbers.charAt(Math.floor(Math.random() * numbers.length)) +
  characters.charAt(Math.floor(Math.random() * characters.length)) +
  numbers.charAt(Math.floor(Math.random() * numbers.length)) +
  characters.charAt(Math.floor(Math.random() * characters.length)) +
  numbers.charAt(Math.floor(Math.random() * numbers.length));
export const eventsHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  chokidar.watch(`./public`).on("all", (event, path) => {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss").toString(),
      "[Action]:",
      event,
      ` on this file =====>  ./${path}`
    );
    fs.writeFile(
      "./log.txt",
      `${moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .toString()}: FILE ACTION TRIGGERED \n`,
      { flag: "a+" },
      (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      }
    );
    let data = "";
    let result;
    if (event === "add") {
      try {
        console.log("TYING TO READ FROM", `./${path}`);
        data = fs.readFileSync(`./${path}`);
        data = JSON.parse(data);
        //console.log("DATA READ :", data);
        data.result.images.lp_img =
          carsImg[Math.floor(Math.random() * carsImg.length)];
        data.result.images.normal_img =
          carsImg[Math.floor(Math.random() * carsImg.length)];
        data.result.images.aux_img =
          carsImg[Math.floor(Math.random() * carsImg.length)];

        data.result.anpr.text = generateImmat();
        result = {
          status: "UNREAD",
          sentAt: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
          data: data.result,
        };
        if (res.writableEnded) return;
        res.write(`data: ${JSON.stringify(result)}\n\n`);
        fs.writeFile(
          "./log.txt",
          `${moment().format("YYYY-MM-DD HH:mm:ss").toString()}: EVENT SENT \n`,
          { flag: "a+" },
          (err) => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          }
        );
        console.log(
          moment().format("YYYY-MM-DD HH:mm:ss").toString(),
          "[Log]: event sent"
        );
      } catch (e) {
        console.log("[ERROR]", e);
      }
    }

    // res.write() instead of res.send()
    console.log(
      "================================= END ================================="
    );
  });

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("[LOG]: Client dropped connection to SSE - Local Server !");
    fs.unwatchFile("./public/event_data.json");
    res.end();
  });
};
//srpi12345
//475 947 982
