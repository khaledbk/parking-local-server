import multer from "multer";
import crypto from "crypto";
import async from "async";

const scans = {
  count: 0,
  increment: function () {
    this.count++;
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${scans.count}_${crypto
      .randomBytes(8)
      .toString("hex")}_cam_event.json`;
    cb(null, uniqueFilename);
  },
});

const maxSize = 1 * 1000 * 10000;

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).any();

const uploadQueue = async.queue(async (task, done) => {
  try {
    await task();
    done();
  } catch (err) {
    done(err);
  }
}, 1);

uploadQueue.error((err, task) => {
  console.error("There was an error processing a file upload:", err);
});

export const camEventsHandler = async (req, res) => {
  uploadQueue.push(async () => {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          handleError(err, res);
          reject(err);
        } else {
          scans.increment();
          res.sendStatus(200);
          resolve();
        }
      });
    });
  });
};

const handleError = (error, res) => {
  console.error("upload error: ", error);
  res.status(500).send({ error: "File upload failed. Please try again." });
};
