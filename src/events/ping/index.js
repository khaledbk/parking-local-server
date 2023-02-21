import { tcpPingPort } from "tcp-ping-port";

export const pingmanHandler = async (req, res) => {
  const host = req.body.host;
  const port = req.body.port;
  console.log("PINGING : ", host);
  let response = await tcpPingPort(host); //should check to add port here
  res.send({ response });
};
