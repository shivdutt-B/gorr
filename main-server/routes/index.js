const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");
const { githubCallback, getMe, logout } = require("../controllers/authController");
const { buildProject } = require("../controllers/buildProjectController");
const { redeployProject } = require("../controllers/redeployProjectController");
const { checkSlugAvailability } = require("../controllers/slugController");
const { getUserProjects } = require("../controllers/projectController");
const { deleteProject } = require("../controllers/deleteProjectController");

// Public Authentication routes
router.get("/auth/github/callback", githubCallback);

// Public Utility routes
router.get("/check-slug", checkSlugAvailability);

// Authenticated User routes
router.get("/auth/me", requireAuth, getMe);
router.post("/auth/logout", requireAuth, logout);

// Protected Project management and deployment routes
router.get("/projects", requireAuth, getUserProjects);
router.post("/deploy-project", requireAuth, buildProject);
router.post("/redeploy-project", requireAuth, redeployProject);
router.post("/delete-project", requireAuth, deleteProject);

module.exports = router;
