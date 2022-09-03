import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/events/cameras/index.js";
import cron from "node-cron";
const PORT = 3002;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const handleCamera = (req, res) => {
  console.log(req);

  console.log("====================================");
  res.send(200);
};
app.get("/cameras", eventsHandler);
app.get("/", handleCamera);

// cron.schedule("20 * * * * *", () => {
//   console.log("running a task every 20 sec");
// });

app.listen(PORT, () => {
  console.log("🚀 . . . . Server is running on port ", PORT);
});
