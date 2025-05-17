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
const HOST = process.env.HOST || "localhost"

// 인증서 경로
const sslOptions = {
    key: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
    cert: fs.readFileSync(process.env.PUBLIC_KEY_PATH)
};

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes);

// 요약 라우터
const summarizeRoutes = require("./routes/summarize")
app.use("/api", summarizeRoutes);


// 추출 라우터
const extractRoutes = require("./routes/extract")
app.use("/api/extract", extractRoutes);

// prod/dev 모두 HTTP 서버 실행
app.listen(PORT, HOST, () => {
    console.log(`🚀 [${process.env.NODE_ENV.toUpperCase()}] HTTP server running at http://${HOST}:${PORT}`);
});