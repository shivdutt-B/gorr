const express = require("express");
const router = express.Router();
const { buildProject } = require("../controllers/buildProjectController");

router.post("/deploy-project", buildProject);

module.exports = router;
