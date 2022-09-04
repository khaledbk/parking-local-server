import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const eventsHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client
  
  fs.watchFile("./public/event_data.json",function(current, previous) {
    console.log("File changed!");
    let data = ""

    data = fs.readFileSync("./public/event_data.json")
    data = JSON.parse(data);
    console.log('file read ...')
    
    let result = {
      _id: uuidv4(),
      status: "UNREAD",
      sentAt: new Date(),
      data: data.result
    };
    // res.write() instead of res.send()
    if (res.writableEnded) return;
    res.write(`data: ${JSON.stringify(result)}\n\n`);
  });


  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    fs.unwatchFile("./public/event_data.json");
    res.end();
  });
};
//srpi12345
//475 947 982
