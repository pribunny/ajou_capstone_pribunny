import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom'
import './App.css'
import ResultPage from './pages/ResultPage'
import Popup from './pages/Popup'
import SettingPage from './pages/SettingPage'

function App() {
  return (
      <Routes>
          {/*내부 페이지 라우팅을 진행한다 -> 새 페이지를 추가할 거면 여기에 먼저 라우팅을 설정하고 만들면 된다.*/}
          <Route path="/" element={<Popup />} />
          <Route path="/start" element={<ResultPage />} />
          <Route path="/setting" element={<SettingPage />} />
      </Routes>

  );
}

export default App

