const express = require("express");
const path = require("path");
const fse = require("fs-extra");

require("dotenv").config();

const multer = require("multer");

const port = process.env.PORT || 80;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const UPLOAD_PATH = path.join(__dirname, "public", "uploads");

const fileStorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    let fn = file.originalname.replaceAll(":", "-");
    cb(null, Date.now() + "--" + fn);
  },
});

var uploadSnaps = multer({ storage: fileStorageEngine }).single("image");

app.post("/saveSnap", function (req, res) {
  uploadSnaps(req, res, async function (err) {
    if (err) {
      console.log(err);
      //res.json({ success: false, error: { message: 'Upload failed:: ' + JSON.stringify(err) }  });
    } else {
      console.log(req.body);
      res.redirect("/");

      //res.json({ success: true, id: req.body.id });

      //if (VERSION==="06") await sendPushNotifications(req.body.title);
    }
  });
});

app.get("/snaps", function (req, res) {
  let files = fse.readdirSync(UPLOAD_PATH);
  files = files.reverse();

  console.log("In", UPLOAD_PATH, "there are", files);
  res.json({ files });
});

app.listen(port);
