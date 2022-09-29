import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/events/cameras/index.js";
import cron from "node-cron";
import multer from "multer";
import moment from "moment";

const PORT = 3002;
export const app = express();
let test = 1;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + test + ".json");
    cb(null, file.fieldname + ".json");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 10000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).any();

const handleCamera = (req, res) => {
  console.log(
    "================================= POST-REQUEST ================================="
  );
  //console.log(JSON.stringify(req.));

  upload(req, res, function (err) {
    console.log(JSON.stringify(req.body));
    if (err) {
      console.log("upload err: ", err);
      res.send(err);
    } else {
      console.log(
        moment().format("LLLL").toString(),
        "==========",
        test,
        "=========="
      );
      test++;
      //console.log("camera trigger");
      res.sendStatus(200);
    }
  });
  console.log(
    "================================= END ================================="
  );
};

app.get("/cameras", eventsHandler);
app.post("*", handleCamera);

// cron.schedule("20 * * * * *", () => {
//   console.log("running a task every 20 sec");
// });

app.listen(PORT, () => {
  console.log("🚀 . . . . Server is running on port ", PORT);
});
