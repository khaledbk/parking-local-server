import { v4 as uuidv4 } from "uuid";

export const eventsHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  let counter = 0;
  let interValID = setInterval(() => {
    counter++;

    if (counter >= 100) {
      clearInterval(interValID);
      res.end(); // terminates SSE session
      return;
    }
    let result = {
      _id: uuidv4(),
      image: "",
      status: "UNREAD",
      sentAt: new Date(),
    };
    res.write(`data: ${JSON.stringify(result)}\n\n`); // res.write() instead of res.send()
  }, 15000);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    clearInterval(interValID);
    res.end();
  });
};
//srpi12345
//475 947 982
