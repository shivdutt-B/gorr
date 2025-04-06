const express = require('express');
const router = express.Router();
const { redeployProject } = require("../controllers/redeployProjectController");

router.post("/redeploy-project", redeployProject);

module.exports = router;