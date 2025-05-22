import React from "react";
import { useNavigate } from 'react-router-dom';

import ErrorIcon from '../assets/error_icon.png';
import HomeIcon from '../assets/home-button.png';

const ShowError = ({ message }) => {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-start bg-yellow-01 p-10">
            <div className='w-full flex items-center justify-center mt-6 relative mb-2'>
                <h2 className='text-3xl font-bold py-2'>PRIBUNNY</h2>
                <button className="absolute right-96 "
                    onClick={() => navigate('/')}>
                    <img src={HomeIcon} alt="home_icon" className="w-[35px] h-[35px]" />
                </button>
            </div>
            <div className=" flex-1 flex flex-col justify-center">
                <img src={ErrorIcon} alt="Error Bunny Img"
                    className="w-[400px] h-auto mb-4 opacity-40 top-1/2 left-1/2"/>
                <div>
                    <h3 className="text-2xl font-bold text-center mb-2">{message}</h3>
                    <p className="text-xl text-center">홈 화면을 눌러 다시 시도해주세요!</p>
                </div>
            </div>
        </div>
    );
};

export default ShowError;