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

// 서버 실행
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔒 HTTPS server running at https://localhost:${PORT}/api`);
});