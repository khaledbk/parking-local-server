import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { eventsHandler } from "./src/events/cameras/index.js";
import cron from "node-cron";
const PORT = 3002;
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set("views",path.join(process.cwd(),"views"))

// View Engine Setup
app.set("view engine","ejs")
    
// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
    
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "public")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 10000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize }, 
  
// mypic is the name of file attribute
}).any();     

const handleDefault = (req, res) => {
  console.log(JSON.stringify(req.headers));
  console.log("====================================");

    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
            console.log("multer err: ", err)
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
            res.send(200); // res.write() instead of res.send()
          
            // If client closes connection, stop sending events
            

        }
    }) 
};

app.get("/sse", eventsHandler);
app.post("*", handleDefault);

// cron.schedule("20 * * * * *", () => {
//   console.log("running a task every 20 sec");
// });

app.listen(PORT, () => {
  console.log("🚀 . . . . Server is running on port ", PORT);
});
