const express = require("express");
const ConventionRepository = require("../repositories/conventionRepository");
const ConventionService = require("../services/conventionService");
const ConventionController = require("../controllers/conventionController");


const router = express.Router();

const repo = new ConventionRepository();
const service = new ConventionService(repo);
const controller = new ConventionController(service);

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
