const express = require("express");
const router = express.Router();
const { getUserProjects } = require("../controllers/projectController");

router.get("/projects", getUserProjects);

module.exports = router;
