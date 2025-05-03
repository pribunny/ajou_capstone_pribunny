import { useEffect, useState } from 'react';

function DragPage({ text }) {
  const [selectedText] = useState(text);
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // 초기 위치

  useEffect(() => {
    // 마우스 마지막 위치 기준으로 버튼 위치 지정
    const mouseUpHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mouseup', mouseUpHandler);

    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

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
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            background: '#111',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 100000
          }}
          onClick={handleAnalyzeClick}
        >
          🔍 분석하기
        </div>
      )}

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: `${position.y + 30}px`,
            left: `${position.x}px`,
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
