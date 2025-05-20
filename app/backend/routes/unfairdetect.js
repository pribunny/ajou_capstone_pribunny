const express = require("express");
const router = express.Router();

// 요약 API 로직을 담당하는 컨트롤러 불러오기
const  detectText  = require("../controllers/unfairDetectController");

// 요약 API 경로
router.post("/", detectText);

module.exports = router;
