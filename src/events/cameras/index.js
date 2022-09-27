// import { v4 as uuidv4 } from "uuid";

// function makeid(length) {
//   var result = "";
//   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// export const eventsHandler = (req, res) => {
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders(); // flush the headers to establish SSE with client

//   let counter = 0;
//   let interValID = setInterval(() => {
//     counter++;

//     if (counter >= 100) {
//       clearInterval(interValID);
//       res.end(); // terminates SSE session
//       return;
//     }
//     let result = {
//       _id: uuidv4(),
//       img: "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/body-image/public/02ladavestacross.jpg?itok=aWgNBEWf",
//       plateNum: makeid(6),
//       status: "UNREAD",
//       sentAt: new Date(),
//     };
//     res.write(`data: ${JSON.stringify(result)}\n\n`); // res.write() instead of res.send()
//   }, 5000);

//   // If client closes connection, stop sending events
//   res.on("close", () => {
//     console.log("client dropped me");
//     clearInterval(interValID);
//     res.end();
//   });
// };
//srpi12345
//475 947 982

import { v4 as uuidv4 } from "uuid";
import fs from "fs";

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const eventsHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  fs.watchFile("./public/event_data.json", function (current, previous) {
    console.log("File changed!");
    let data = "";

    data = fs.readFileSync("./public/event_data.json");
    data = JSON.parse(data);
    console.log("file read ...");

    let result = {
      status: "UNREAD",
      sentAt: new Date(),
      data: data.result,
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
