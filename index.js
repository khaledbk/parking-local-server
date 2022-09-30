import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/events/cameras/index.js";
import multer from "multer";
import moment from "moment";
import fs from "fs";
import path from "path";

const PORT = 3002;
export const app = express();
const directory = "public";
fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

fs.writeFile(
  "./log.txt",
  `${moment()
    .format("YYYY-MM-DD HH:mm:ss")
    .toString()}: ========= server started ========= \n`,
  { flag: "a+" },
  (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  }
);
app.use(bodyParser({ limit: "50mb" }));
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
    //cb(null, test + "_" + file.originalname + ".json");
    cb(null, moment().format("YYYY-MM-DD HH:mm:ss") + "_plate_detection.json");
    //cb(null, file.originalname);
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
    `================================= POST-REQUEST ${test}=================================`
  );
  fs.writeFile(
    "./log.txt",
    `${moment()
      .format("YYYY-MM-DD HH:mm:ss")
      .toString()}: ${test} POST REQUEST RECEIVED \n`,
    { flag: "a+" },
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    }
  );

  upload(req, res, function (err) {
    if (err) {
      console.log("upload err: ", err);
      res.send(err);
    } else {
      test++;
      fs.writeFile(
        "./log.txt",
        `${moment().format("YYYY-MM-DD HH:mm:ss").toString()}: FILE WRITTEN \n`,
        { flag: "a+" },
        (err) => {
          if (err) {
            console.error(err);
            fs.writeFile(
              "./log.txt",
              `${moment()
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()}: [ERROR WRITE FILE] ${JSON.stringify(err)} \n`,
              { flag: "a+" },
              (err) => {
                if (err) {
                  console.error(err);
                }
                // file written successfully
              }
            );
          }
          // file written successfully
        }
      );
      //console.log("camera trigger");
      res.sendStatus(200);
    }
  });
};

app.get("/cameras", eventsHandler);
app.post("*", handleCamera);

// cron.schedule("20 * * * * *", () => {
//   console.log("running a task every 20 sec");
// });

app.listen(PORT, () => {
  console.log("🚀 . . . . Server is running on port ", PORT);
});
