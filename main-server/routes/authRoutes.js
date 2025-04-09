const express = require("express");
const router = express.Router();
const { githubCallback } = require("../controllers/authController");

router.get("/github/callback", githubCallback);

module.exports = router;
