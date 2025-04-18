import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';

export default function Popup() {
  const navigate = useNavigate();

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
