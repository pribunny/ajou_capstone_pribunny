/* global chrome */
console.log("hello. This is getSource");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "giveMeText") {
        console.log("📨 요청 받음 → 텍스트 전송");
        chrome.runtime.sendMessage({
            action: "getSource",
            source: document.body.innerText
        });
    }
});

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length === 0) return;

  // 기존 요소 제거
  const existing = document.getElementById("pribuddy-float");
  if (existing) existing.remove();

  // 드래그 영역의 좌표 구하기
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // 새 UI 요소 생성
  const floatBox = document.createElement("div");
  floatBox.id = "pribuddy-float";
  floatBox.innerText = "🔍 분석하기";
  floatBox.style.position = "absolute";
  floatBox.style.top = `${window.scrollY + rect.bottom + 8}px`;  // 현재 스크롤 고려
  floatBox.style.left = `${window.scrollX + rect.left}px`;
  floatBox.style.background = "#111";
  floatBox.style.color = "#fff";
  floatBox.style.padding = "6px 12px";
  floatBox.style.borderRadius = "6px";
  floatBox.style.zIndex = "999999";
  floatBox.style.cursor = "pointer";
  floatBox.style.fontSize = "13px";
  floatBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";

  floatBox.addEventListener("click", () => {
    // 여기에 popup 형태로 UI 띄우기
    const popup = document.createElement("div");
    popup.innerText = `"${selectedText}" 에 대한 분석 결과입니다...`; // 예시
    popup.style.position = "absolute";
    popup.style.top = `${window.scrollY + rect.bottom + 40}px`;
    popup.style.left = `${window.scrollX + rect.left}px`;
    popup.style.background = "#f9f9f9";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.borderRadius = "6px";
    popup.style.fontSize = "14px";
    popup.style.zIndex = "999999";
    popup.id = "pribuddy-popup";

    document.body.appendChild(popup);
  });

  document.body.appendChild(floatBox);
});

