/*
 앱 진입점
*/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.API_PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/api`);
});