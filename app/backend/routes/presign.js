const express = require("express");
const router = express.Router();
const  { generatePresignedUrl } = require("../controllers/presignController");

// POST /api/files/presign
router.post("/", generatePresignedUrl);

module.exports = router;
