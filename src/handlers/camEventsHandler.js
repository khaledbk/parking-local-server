import multer from "multer";
import crypto from "crypto";
import async from "async";

export const eventsIpAddresses = {}; // Global variable to store IP addresses

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
  } catch (err) {}
}, 1);

uploadQueue.error((err, task) => {
  console.error("There was an error processing a file upload:", err);
});

const extractIPv4 = (ipAddress) => {
  if (ipAddress.startsWith("::ffff:")) {
    return ipAddress.slice(7);
  }
  return ipAddress;
};

export const camEventsHandler = async (req, res) => {
  uploadQueue.push(async () => {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          handleError(err, res);
          reject(err);
        } else {
          let clientIP =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          clientIP = extractIPv4(clientIP);
          const uniqueFilename = res.req.files[0].filename;
          eventsIpAddresses[uniqueFilename] = clientIP; // Save the IP address with the filename as key
          // console.log("eventsIpAddresses", eventsIpAddresses);
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
