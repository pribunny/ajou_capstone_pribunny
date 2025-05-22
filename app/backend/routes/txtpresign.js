const express = require("express");
const router = express.Router();
const  { generatePresignedUrl } = require("../controllers/txtpresignController");

// POST /api/files/presign
router.post("/", generatePresignedUrl);

module.exports = router;
