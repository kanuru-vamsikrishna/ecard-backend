const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");

const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");
const candidateController = require("../controllers/candidateController");
const Uploader = require("../models/photoUpload");

// users crud
router.post("/user/register", userController.Create);
router.post("/user/login", userController.Login);
router.get("/user/account", authenticateUser, userController.Account);
router.delete("/user/logout", authenticateUser, userController.Delete);

// candidate crud
router.post(
  "/candidate/register",
  authenticateUser,
  candidateController.Create
);
router.get("/candidate/list", authenticateUser, candidateController.List);
router.get("/candidate/:id", authenticateUser, candidateController.Show);
router.put("/candidate/:id", authenticateUser, candidateController.Update);
router.delete("/candidate/:id", authenticateUser, candidateController.Delete);

// Multer
const DIR = "./imageFiles/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid.v4() + "-" + filename);
  },
});

let minSize = 1 * 1024 * 1024;

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/pnp" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(
  "/candidate/photo",
  authenticateUser,
  upload.single("image"),
  (req, res) => {
    const fileSize = parseInt(req.headers["content-length"]);
    console.log(fileSize, minSize);
    if (fileSize < minSize) {
      return res.status(403).json({
        message: "File size should be more than 1MB",
        status: 403,
      });
    } else {
      const url = req.protocol + "://" + req.get("host");
      // console.log(fileSize);
      const uploader = new Uploader({
        image: url + "/imageFiles/" + req.file.filename,
      });
      uploader
        .save()
        .then((result) => {
          res.status(201).json({
            message: "uploaded successfully",
            uploaderCreated: {
              _id: result._id,
              image: result.image,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  }
);

router.post(
  "/candidate/sign",
  authenticateUser,
  upload.single("image"),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const uploader = new Uploader({
      image: url + "/imageFiles/" + req.file.filename,
    });
    uploader
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Uploaded successfully",
          signatureCreated: {
            _id: result._id,
            image: result.image,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.get("/imageFiles/:filename", (req, res) => {
  const fileName = req.params.filename;
  res.sendFile(fileName, { root: "./imageFiles" });
});

module.exports = router;
