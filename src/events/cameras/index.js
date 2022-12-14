import fs from "fs";
import moment from "moment";
import chokidar from "chokidar";

let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let numbers = "0123456789";

const carsImg = [
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
];

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

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

  chokidar.watch(`.\\public`).on("all", (event, path) => {
    console.log(
      moment().format("YYYY-MM-DD HH:mm:ss").toString(),
      "[Action]:",
      event,
      ` on this file =====>  .\\${path.replace("/", "\\")}`
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
        console.log("TYING TO READ FROM", `.\\${path.replace("/", "\\")}`);
        setTimeout(() => {
          data = fs.readFileSync(`.\\${path.replace("/", "\\")}`);
          if (isJsonString(data)) {
            console.log("THIS IS VALID JSON");
            data = JSON.parse(data);
            result = {
              status: "UNREAD",
              sentAt: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
              data: data.result,
            };
            if (res.writableEnded) return;
            res.write(`data: ${JSON.stringify(result)}\n\n`);
          }
        }, 100);
        //        console.log("DATA READ :", data);
        // data.result.images.lp_img =
        // carsImg[Math.floor(Math.random() * carsImg.length)];
        // data.result.images.normal_img =
        // carsImg[Math.floor(Math.random() * carsImg.length)];
        // data.result.images.aux_img =
        // carsImg[Math.floor(Math.random() * carsImg.length)];

        // data.result.anpr.text = generateImmat();

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

  // fs.watchFile("./public/event_data.json", function (current, previous) {

  // });

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    fs.unwatchFile("./public/event_data.json");
    res.end();
  });
};
//srpi12345
//475 947 982
