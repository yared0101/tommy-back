const express = require("express");
const { sendTelegramMessage } = require("../controllers/contact.controller");
const router = express.Router();

// const userHandlers = new UserController();
router.post("/", sendTelegramMessage);

module.exports = router;
