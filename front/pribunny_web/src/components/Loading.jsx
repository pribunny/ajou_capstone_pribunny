import React from "react";
import { SyncLoader } from "react-spinners";
import LoadingImage from '../assets/extension_loading.png';
//npm i react-spinners --save

const Loading = () => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-start bg-yellow-01 p-10">
            <div className='w-full flex items-center justify-center mt-6 relative mb-2'>
                <h2 className='text-3xl font-bold py-2'>PRIBUNNY</h2>
            </div>
            <div className ="flex-1 flex flex-col justify-center">
                <img src={LoadingImage} alt="Loading.." className="w-[350px] h-auto mx-auto"/>
                <SyncLoader margin={10}  cssOverride={{ display: 'block', margin: 20 }} />
                <p className="mx-4 text-2xl font-bold">분석을 진행하고 있어요.</p>
                <p className="mx-4 text-xl">이 탐지 결과는 정보 제공을 위한 것이며, 법적 판단이나 자문을 대체하지 않습니다.</p>
            </div>
        </div>
    );
};

export default Loading;