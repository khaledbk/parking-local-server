import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/events/cameras/index.js";
const PORT = 3002;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/cameras", eventsHandler);

app.listen(PORT, () => {
  console.log("🚀 . . . . Server is running on port ", PORT);
});
