// const axios = require("axios");
// const { splitHtmlToParagraphs } = require("../utils/htmlParser");  // htmlParser.js 불러오기

// const FASTAPI_SUMMARIZE_URL = "http://backend-ml:8000/summary/";

// exports.summarizeText = async (req, res) => {
//     const { text } = req.body;

//     // console.log("📥 받은 텍스트:", text); 

//     if (!text) {
//         return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
//     }

//     try {
//         const response = await axios.post(FASTAPI_SUMMARIZE_URL, { text });
//         const { result } = response.data;
        
//          res.json(response.data);
//     } catch (error) {
//         console.error("🔥 요약 중 FastAPI 호출 에러:", error.message);
//         res.status(500).json({ error: "요약 처리 실패" });
//     }
// };

const axios = require("axios");
const { splitHtmlToParagraphs } = require("../utils/htmlParser");

const FASTAPI_SUMMARIZE_URL = "http://backend-ml:8000/summary/";

exports.summarizeText = async (req, res) => {
    const { text } = req.body;

    console.log("📥 [요청 수신] 받은 text:", text);

    if (!text) {
        console.warn("⚠️ 텍스트가 비어 있습니다.");
        return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
    }

    try {
        // 파싱 시도
        const paragraphs = splitHtmlToParagraphs(text);
        console.log("🔍 [파싱 완료] 분리된 문단:", paragraphs);

        // 요약 요청
        console.log("📤 [FastAPI 요청] URL:", FASTAPI_SUMMARIZE_URL);
        const response = await axios.post(FASTAPI_SUMMARIZE_URL, { text });
        console.log("✅ [FastAPI 응답] 수신 완료:", response.data);

        res.json(response.data);
    } catch (error) {
        console.error("🔥 [오류 발생] FastAPI 호출 중 오류");
        console.error("🧾 error.message:", error.message);
        console.error("📄 error.stack:", error.stack);
        res.status(500).json({ error: "요약 처리 실패", detail: error.message });
    }
};
