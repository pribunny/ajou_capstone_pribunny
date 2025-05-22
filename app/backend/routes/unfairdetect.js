// const express = require("express");
// const router = express.Router();

// // 요약 API 로직을 담당하는 컨트롤러 불러오기
// const  detectText  = require("../controllers/unfairDetectController");

// // 요약 API 경로
// router.post("/", detectText);

// module.exports = router;
const express = require("express");
const router = express.Router();

// 객체 안의 함수명을 맞춰서 불러오기
const { detectController } = require("../controllers/unfairDetectController");

// 라우팅 경로에 함수 넘기기
router.post("/", detectController);

module.exports = router;
