import { useEffect, useState } from 'react';
import Logo from '../assets/extension_logo.png';

function DragPage({ text, mouseX, mouseY, lastRect, widthRect }) {
  const [selectedText] = useState(text);
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({x:mouseX, y:mouseY});

  const handleAnalyzeClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {!showPopup && (
        <div
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            background: '#fff',
            color: '#111',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 100000
          }}
          onClick={handleAnalyzeClick}
        >
          <img src={Logo} alt="logo"/>
        </div>
      )}

      {showPopup && (
        <div
          style={{
            position: 'absolute',
            top: lastRect.top + lastRect.height / 2,
            left: lastRect.left + lastRect.width / 2,
            width: '300px',
            background: '#fff',
            color: '#000',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 100001
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>🔍 분석 결과</div>
            <button onClick={handleClose} style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer'
            }}> X </button>
          </div>
          <div style={{ marginTop: '10px' }}>{selectedText}</div>
        </div>
      )}
    </>
  );
}

export default DragPage;
