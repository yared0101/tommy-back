const express = require("express");
const imagesRoutes = require("./images.routes");
const userRoutes = require("./user.routes");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/images", imagesRoutes);

module.exports = router;
