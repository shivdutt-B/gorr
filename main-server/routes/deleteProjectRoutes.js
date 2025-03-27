const express = require("express");
const { deleteProject } = require("../controllers/deleteProjectController");

const router = express.Router();

router.post("/delete-project", deleteProject);

module.exports = router;
