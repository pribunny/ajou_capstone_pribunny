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
                <p className="mx-4 text-2xl">분석을 진행하고 있어요.</p>
            </div>
        </div>
    );
};

export default Loading;