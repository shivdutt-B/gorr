const express = require("express");
const router = express.Router();

const { githubCallback } = require("../controllers/authController");
const { buildProject } = require("../controllers/buildProjectController");
const { redeployProject } = require("../controllers/redeployProjectController");
const { checkSlugAvailability } = require("../controllers/slugController");
const { getUserProjects } = require("../controllers/projectController");
const { deleteProject } = require("../controllers/deleteProjectController");

// Authentication routes
router.get("/auth/github/callback", githubCallback);

// Project management and deployment routes
router.get("/projects", getUserProjects);
router.get("/check-slug", checkSlugAvailability);
router.post("/deploy-project", buildProject);
router.post("/redeploy-project", redeployProject);
router.post("/delete-project", deleteProject);

module.exports = router;
