const express = require("express");
const UserService = require("../services/UserService");
const UserController = require("../controllers/UserController");

const router = express.Router();
const service = new UserService();
const controller = new UserController(service);

router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
