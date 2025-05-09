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


document.addEventListener("mouseup", (event) => {
  setTimeout(() => { //Timeout을 걸지 않으면 제대로 인식하지 못하는 문제가 발생
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    console.log("MouseUP : [선택한 텍스트]", selectedText);

    if (selectedText.length > 200 && selectedText.length < 1000) {
      console.log("MouseUP : [선택한 텍스트]가 200자 이상 1000자 이하에 포함됩니다.");

      const mouseX = event.pageX;
      const mouseY = event.pageY;

      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      const widthRect = rects[rects.length-2]; //뒤에서 2번쨰 위치한 값이 온전한 한 줄이라 판단
      const lastRect = rects[rects.length-1];

      console.log("MouseUP : [현재 마우스 위치]", mouseX, mouseY);
      console.log("MouseUP : [선택된 드래그의 크기]", lastRect);

      if (!document.getElementById("floating-analyzer-root")) {
        console.log("MouseUP : 지금 dragpage 렌더링 됨");
        const div = document.createElement("div");
        div.id = "floating-analyzer-root";
        document.body.appendChild(div);
        createRoot(div).render(
          <DragPage text={selectedText} mouseX={mouseX} mouseY={mouseY} lastRect={lastRect} widthRect={widthRect} />
        );
      } else {
        console.log("MouseUP : 지금 dragpage 삭제됨");
        const remove_element = document.getElementById("floating-analyzer-root");
        remove_element.remove();
      }
    }
  }, 0);
});

document.addEventListener("mousedown", () => {
    // 생성되어 있는 DragPage 렌더링을 끊는다.
    // 만약 없다면? -> 그냥 아무것도 하지 않는다.
    // mousedown은 계속해서 발생함(버튼을 누르는 순간까지도) -> 드래그된 데이터가 없을 때만 반응하도록 설정
    // 팝업창 그러니까 결과 페이지가 있는 경우에, 클릭이 발생하면, 팝업창이 사라지지 않도록 해야 한다.
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
