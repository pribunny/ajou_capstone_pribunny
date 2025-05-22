import React from "react";
import { useNavigate } from 'react-router-dom';

import ErrorIcon from '../assets/error_icon.png';
import HomeIcon from '../assets/home-button.png';

const ShowError = ({ message }) => {
    const navigate = useNavigate();

    return (
        <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-yellow-01 p-6 sm:p-10">
            <div className='w-full flex justify-center mb-4 relative'>
                <h2 className='text-2xl sm:text-3xl font-bold text-black'>PRIBUNNY</h2>
                <button
                    onClick={() => navigate('/')}>
                    <img src={HomeIcon} alt="home_icon" className="w-8 h-8 sm:w-9 sm:h-9 right-4 md:right-0" />
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-black text-center">
                <img src={ErrorIcon} alt="Error Bunny Img"
                    className="w-full max-w-[280px] sm:max-w-[350px] mb-6 opacity-40"/>
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{message}</h3>
                    <p className="text-base sm:text-xl">홈 화면을 눌러 다시 시도해주세요!</p>
                </div>
            </div>
        </div>
    );
};

export default ShowError;