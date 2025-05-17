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

// 환경에 따라 서버 실행 방식 분기
if (process.env.NODE_ENV === "production") {
    const sslOptions = {
        key: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
        cert: fs.readFileSync(process.env.PUBLIC_KEY_PATH)
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🔒 [PROD] HTTPS server running at https://localhost:${PORT}`);
    });
} else {
    http.createServer(app).listen(PORT, () => {
        console.log(`🌱 [DEV] HTTP server running at http://localhost:${PORT}`);
    });
}
