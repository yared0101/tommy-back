const express = require("express");
const imagesRoutes = require("./images.routes");
const userRoutes = require("./user.routes");
const contactRoutes = require("./contact.routes");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/images", imagesRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
