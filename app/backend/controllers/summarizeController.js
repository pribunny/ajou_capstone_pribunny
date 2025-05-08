const axios = require("axios");
const { splitHtmlToParagraphs } = require("../utils/htmlParser");

const FASTAPI_SUMMARIZE_URL = "http://backend-ml:8000/llm/summaries/";

exports.summarizeText = async (req, res) => {
    const { summaryText } = req.body;
    const { data_size } = req.query;

    if (!summaryText) {
        console.warn("⚠️ 텍스트가 비어 있습니다.");
        return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
    }

    try {
        let allSummaries = [];

        if (data_size === "long") {
            const paragraphs = splitHtmlToParagraphs(summaryText);
            console.log("📄 분리된 문단:", paragraphs);

            const summaryPromises = paragraphs.map(async (paragraph, idx) => {
                console.log(`📤 문단 ${idx + 1} 전송:`, paragraph);
                const response = await axios.post(FASTAPI_SUMMARIZE_URL, {
                    inputContext: paragraph,
                });
                const summaryItems = response.data.data.summaryItems.map(item => ({
                    category_name: item.category_name,
                    summarize_content: item.summarize_content
                }));

                console.log(`📥 문단 ${idx + 1} 응답 요약:`, summaryItems);

                return summaryItems;
            });

            const allItemsNested = await Promise.all(summaryPromises);
            allSummaries = allItemsNested.flat()

        } else {
            const response = await axios.post(FASTAPI_SUMMARIZE_URL, {
                inputContext: summaryText,
            });
            allSummaries = response.data.data.summaryItems.map(item => ({
                category_name: item.category_name,
                summarize_content: item.summarize_content
            }));
        }

        return res.json({ summary: allSummaries });

    } catch (error) {
        console.error("🔥 [오류 발생] FastAPI 호출 중 오류");
        console.error("🧾 error.message:", error.message);
        res.status(500).json({ error: "요약 처리 실패", detail: error.message });
    }
};
