const express = require("express");
const router = express.Router();

// 컨트롤러에서 함수 구조분해 할당으로 받아오기
const { summarizeController } = require("../controllers/summarizeController");

// POST 요청 처리 시 함수 넘기기
router.post("/", summarizeController);

module.exports = router;
