import React from "react";
import { SyncLoader } from "react-spinners";
import LoadingImage from '../assets/extension_loading.png';
//npm i react-spinners --save

const Loading = () => {
    return (
        <div className ="flex-1 flex flex-col justify-center">
            <img src={LoadingImage} alt="Loading.." className="w-[230px] h-[220px] mx-auto"/>
            <h3 className="mx-auto text-2xl font-bold">분석을 진행하고 있어요.</h3>
            <SyncLoader />
        </div>
    );
};

export default Loading;