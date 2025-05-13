import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import { getSummarize } from '../services/summary';
import { getUnfairDetect } from '../services/unfair'; // ✅ 필요


export default function ResultPage() {
  const navigate = useNavigate();
    // ✅ 공통 입력 텍스트 한 번만 선언
  const testText = 
  `
    여기에 테스트용 개인정보처리방침 또는 약관 내용을 작성하세요.
  `;

  const [summaryId, setSummaryId] = useState("");
  const [summaryItems, setSummaryItems] = useState([]);
  const [unfairId, setUnfairId] = useState("");
  const [unfairItems, setUnfairItems] = useState([]);


  useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await getSummarize(testText, 'short');
                setSummaryId(data.summaryId);
                setSummaryItems(data.summaryItems);
            } catch (error) {
                // 에러 핸들링 -> 에러 코드를 출력하면 됨.
                console.error('요약실패', error);
            }
        };

        loadSummary();
    }, []);

  useEffect(() => {
        const testText =
        `

        `
        const loadUnfair = async () => {
            try {
                const data = await getUnfairDetect(testText, 'short');
                setUnfairId(data.unfairId);
                setUnfairItems(data.unfairItems);
            } catch (error) {
                // 에러 핸들링 -> 에러 코드를 출력하면 됨.
                console.error('불공정약관탐지실패', error);
            }
        };

          loadUnfair(); // 함수 이름도 맞춰서 호출
    }, []); 

  return (
    <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 상단 버튼 */}
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => navigate('/setting')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={SetIcon} alt="Setting" className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={HomeIcon} alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* 더보기 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">불공정약관</span>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate('resultdetail', {
                          state: {
                            unfairId,
                            unfairItems
                      }
                })
          }
        >
          더보기
        </button>
      </div>
      
      {/* 독소 조항 출력 영역 (내용 없음) */}
      <div className="border rounded-lg h-24 text-sm flex items-center px-2 whitespace-pre-wrap text-left">
        {unfairItems.length > 0 && (
          <p>
            <strong>
              {unfairItems.map(item => item.category).join(', ')}
            </strong>
            {" 에서 불공정약관을 찾았습니다!"}
          </p>
        )}
      </div>

      {/* 요약 제목 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">요약</span>
      </div>

      {/* 요약 출력 영역 */}
      <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap text-left">
        <br />

        {summaryItems.map((item, idx) => (
          <div key={idx} className="mb-3">
            <strong>{item.category}</strong><br />
            {item.summary_content}
          </div>
        ))}
      </div>
    </div>
  );
}
