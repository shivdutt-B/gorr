const express = require("express");
const { pingHandler } = require("../controllers/pingController");

const router = express.Router();

// Route to handle ping requests
router.get("/", pingHandler);

module.exports = router;
