import multer from "multer";

var scans = 0;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, scans + "_cam_event.json");
  },
});

const maxSize = 1 * 1000 * 10000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).any();

export const camEventsHandler = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("upload err: ", err);
      res.send(err);
    } else {
      scans++;
      res.sendStatus(200);
    }
  });
};
