/* global chrome */
import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';

export default function Popup() {
    const navigate = useNavigate();
    console.log("이건 실행되냐?1");

    useEffect(() => {
        // 현재 탭에 메시지 보내기
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "giveMeText" });
        });

        // 응답 받을 리스너
        const handleMessage = (request) => {
            if (request.action === "getSource") {
                console.log("✅ 받은 텍스트:", request.source);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    console.log("이건 실행되냐?2");
    return (
        <div>
            <h2>Pri-Buddy</h2>
            <button className="bg-primary size-20" onClick={() => navigate('/setting')}>
                <img src = {SetIcon} alt="Setting"/>
            </button>
            <div className="font-serif">
                개인정보처리방침, 수집이용동의서 확인을 원하는 경우 아래 버튼을 눌러주세요.
            </div>
            <button onClick={() => navigate('/start')}>
                Start!
            </button>
        </div>
    );
}

function __onWindowLoad() {
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if(request.action == "getSource") {
      document.body.innerText = request.source;
    }
  });

  function onWindowLoad() {
    chrome.tabs.executeScript(null, {
      file: "getSource.js"
      }, function() {
      if(chrome.extension.lastError) {
        document.body.innerText = 'Error : \n' + chrome.extension.lastError.message;
      }
    });
  }

  window.onload = onWindowLoad;
}
