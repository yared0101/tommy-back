const express = require("express");
const authenticate = require("../auth/authenticate");
const UserController = require("../controllers/user.controller");
const router = express.Router();

// const userHandlers = new UserController();
const { login } = UserController;
router.post("/login", login);

module.exports = router;
