const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const envFile = process.env.NODE_ENV === "production"
    ? ".env.prod"
    : ".env.dev";

require("dotenv").config({ path: envFile });

const app = express();
const PORT = process.env.API_PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// 미들웨어
app.use(cors());
app.use(express.json());

// 헬스 체크 라우터 (ALB 상태 확인용)
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// 라우터
const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes);

// 요약 라우터
const summarizeRoutes = require("./routes/summarize")
app.use("/api/summary", summarizeRoutes);

// 탐지 라우터
const unfairDetectRoutes = require("./routes/unfairdetect")
app.use("/api/unfairDetect", unfairDetectRoutes);

// presigned url 라우터
const presignRoutes = require("./routes/presign")
app.use("/api/files/presign", presignRoutes);

// 웹페이지 분석 라우터
const analyzeRoutes = require("./routes/analyze")
app.use("/api/analyze", analyzeRoutes);

// prod/dev 모두 HTTP 서버 실행
app.listen(PORT, HOST, () => {
    console.log(`🚀 HTTP server running at http://${HOST}:${PORT}`);
});
