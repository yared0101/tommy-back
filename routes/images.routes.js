const express = require("express");
const authenticate = require("../auth/authenticate");
const ImagesController = require("../controllers/images.controller");
const router = express.Router();
const multer = require("multer");
const maxSize = 2 * 1000 * 1000;
const upload = multer({ dest: "tempFiles/", limits: { fileSize: maxSize } });

const { addImages, removeImages, changeIndexes, getImages } = ImagesController;

router.post("/add-to-list", authenticate, upload.array("file[]"), addImages);
router.get("/", getImages);
router.patch("/change-order", authenticate, changeIndexes);
router.delete("/remove-from-list", authenticate, removeImages);

module.exports = router;
