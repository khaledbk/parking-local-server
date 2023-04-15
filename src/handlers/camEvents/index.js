import moment from "moment";
import fs from "fs";
import multer from "multer";

var scans = 0;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, scans + "_cam_event.json");
    // cb(null, scans + "_" + file.fieldname + ".json");
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

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).any();

export const camEventsHandler = (req, res) => {
  console.log(
    `================================= CAM REQUEST DETECTED =================================`
  );
  // fs.writeFile(
  //   "./log.txt",
  //   `${moment()
  //     .format("YYYY-MM-DD HH:mm:ss")
  //     .toString()}: ${scans} POST REQUEST RECEIVED \n`,
  //   { flag: "a+" },
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //     // file written successfully
  //   }
  // );

  upload(req, res, function (err) {
    if (err) {
      console.log("upload err: ", err);
      res.send(err);
    } else {
      scans++;
      // fs.writeFile(
      //   "./log.txt",
      //   `${moment().format("YYYY-MM-DD HH:mm:ss").toString()}: FILE WRITTEN \n`,
      //   { flag: "a+" },
      //   (err) => {
      //     if (err) {
      //       console.error(err);
      //       fs.writeFile(
      //         "./log.txt",
      //         `${moment()
      //           .format("YYYY-MM-DD HH:mm:ss")
      //           .toString()}: [ERROR WRITE FILE] ${JSON.stringify(err)} \n`,
      //         { flag: "a+" },
      //         (err) => {
      //           if (err) {
      //             console.error(err);
      //           }
      //           // file written successfully
      //         }
      //       );
      //     }
      //     // file written successfully
      //   }
      // );
      //console.log("camera trigger");
      res.sendStatus(200);
    }
  });
};
