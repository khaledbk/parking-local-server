import { v4 as uuidv4 } from "uuid";
import fs from "fs"
export const eventsHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  let data = ""

  console.log("multer success")
  // SUCCESS, image successfully uploaded
  data = fs.readFileSync("./public/event_data")
  data = JSON.parse(data);

  console.log('file readed ...')

  res.write(`data: ${JSON.stringify({name:uuidv4()})}`); // res.write() instead of res.send()

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    //clearInterval(interValID);
    res.end();
  });
};
//srpi12345
//475 947 982
