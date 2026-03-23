import React from "react";
import { SyncLoader } from "react-spinners";
import LoadingImage from '../assets/extension_loading.png';
//npm i react-spinners --save

const Loading = () => {
    return (
        <div className ="flex-1 flex flex-col justify-center">
            <img src={LoadingImage} alt="Loading.." className="w-[230px] h-auto mx-auto" />
            <h3 className="mx-auto text-2xl font-bold">분석을 진행하고 있어요.</h3>
            <div className="mx-auto text-l text-center">이 탐지 결과는 정보 제공을 위한 것이며, <br />법적 판단이나 자문을 대체하지 않습니다.</div>
            <SyncLoader margin={10}  cssOverride={{ display: 'block', margin: 20 }} />
        </div>
    );
};

export default Loading;