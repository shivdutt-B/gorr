const express = require("express");
const router = express.Router();
const { checkSlugAvailability } = require("../controllers/slugController");

router.get("/check-slug", checkSlugAvailability);

module.exports = router;
