import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';  // 설정 아이콘 이미지
import HomeIcon from '../assets/home-button.png';   // 홈 아이콘 이미지
import AddIcon from '../assets/add-button.png';     // 더보기 버튼 이미지

export default function SettingPageEntry() {
  const navigate = useNavigate();

  return (
    <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
            
      <div className="relative flex items-center justify-center h-[40px]">
        {/* 설정 버튼 */}
        <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
          <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
        </button>
    
        {/* 제목 */}
        <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
          PRIBUNNY
        </h2>
    
        {/* 홈 버튼 */}
        <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
          <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
        </button>
        </div>
        {/* ✅ 구분선 */}
        <div className="w-full h-[1px] bg-black" />

        {/* ✅ 버튼 그룹 전체 아래로 내리기 */}
        <div className="mt-20 flex flex-col items-center">

          {/* 추가로 더 보고 싶은 항목 */}
          <div className="text-sm font-medium text-gray-700 text-center mb-2">
            추가로 더 보고 싶은 개인정보처리방침 항목을 선택해주세요!
          </div>
          <div className="mt-4 flex flex-col items-center"></div>
          <button 
            className="bg-[#FFF799] w-[79px] h-[40px] rounded flex items-center justify-center shadow-sm hover:bg-[#fff57a] transition text-[18px] font-medium font-['Noto_Sans'] mb-6"
            onClick={() => navigate('/setting/settingaddphrase')}
          >
            →
          </button>

          {/* 수집항목 선택 */}
          <div className="mt-6 flex flex-col items-center"></div>
          <div className="text-sm font-medium text-gray-700 text-center mb-2">
            제공하고 싶지 않은 수집항목을 선택해주세요!
          </div>
          <div className="mt-4 flex flex-col items-center"></div>
          <button 
            className="bg-[#FFF799] w-[79px] h-[40px] rounded flex items-center justify-center shadow-sm hover:bg-[#fff57a] transition text-[18px] font-medium font-['Noto_Sans']"
            onClick={() => navigate('/setting/settingaddprivacy')}
          >
            →
          </button>

        </div>


    </div>
  );
}
