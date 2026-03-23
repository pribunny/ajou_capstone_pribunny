const express = require("express");
const router = express.Router();

// 탐지 API 로직을 담당하는 컨트롤러 불러오기
const analyzeText = require("../controllers/analyzeController");

// 탐지 API 경로
router.post("/", analyzeText);

module.exports = router;


