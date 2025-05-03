/* global chrome */
import { createRoot } from 'react-dom/client';
import React from 'react';
import DragPage from '../src/components/DragPage.jsx';

console.log("--- hello. This is context.jsx ---");
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
    console.log("MouseUP : [선택한 텍스트]", selectedText);
    if (selectedText.length > 200 && selectedText.length < 1000) {
        console.log("MouseUP : [선택한 텍스트]가 200자 이상 1000자 이하에 포함됩니다.");

        if (!document.getElementById("floating-analyzer-root")) {
            console.log("MouseUP : 지금 dragpage 렌더링 됨")
            const div = document.createElement("div");
            div.id = "floating-analyzer-root";
            document.body.appendChild(div);
            createRoot(div).render(<DragPage text={selectedText} />);
        }
        else{
            console.log("MouseUP : 지금 dragpage 삭제됨")
            const remove_element = document.getElementById("floating-analyzer-root");
            remove_element.remove();
        }
    }
});

document.addEventListener("mousedown", () => {
    // 생성되어 있는 DragPage 렌더링을 끊는다.
    // 만약 없다면? -> 그냥 아무것도 하지 않는다.
    // mousedown은 계속해서 발생함(버튼을 누르는 순간까지도) -> 드래그된 데이터가 없을 때만 반응하도록 설정
    console.log("MouseDown : 실행됨.")

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const remove_element = document.getElementById("floating-analyzer-root");

    console.log("MouseDown : 현재 선택된 텍스트의 길이",selectedText.length)

    if(selectedText.length < 1)
    {
        console.log("MouseDown : element 삭제 실행됨.",selectedText.length)
        if(remove_element){
            remove_element.remove();
            }
    }
});
