const axios = require("axios");

const FASTAPI_SUMMARIZE_URL = "http://localhost:8000/summary/";

exports.summarizeText = async (req, res) => {
    const { text } = req.body;

    console.log("📥 받은 텍스트:", text);

    if (!text) {
        return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
    }

    try {
        const response = await axios.post(FASTAPI_SUMMARIZE_URL, { text });
        const { result } = response.data;

        res.json({
            message: "✅ 요약이 성공적으로 완료되었습니다.",
            summary: result
        });
    } catch (error) {
        console.error("🔥 요약 중 FastAPI 호출 에러:", error.message);
        res.status(500).json({ error: "요약 처리 실패" });
    }
};
