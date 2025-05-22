import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import StartIcon from '../assets/start-button.png';
import MainImg_file from '../assets/main_bunny.png';
import MainImg from '../assets/main_bunny_2.jpg';

import Addfile from '../components/Addfile';
import {getPresignedUrl, uploadToS3, notifyServer} from '../services/uploadFile.js'
import App from '../App';

export default function Home(){
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [clearInput, setClearInput] = useState(false);
    console.log("선택된 파일 : ", selectedFiles.length);

    const handleUpload = async() => {
        try{
            if(selectedFiles.length === 0){
                alert("파일을 업로드해주세요.");
                return;
            }

            const fileNames = selectedFiles.map(file => file.name);
            const fileTypes = selectedFiles.map(file => file.type);

            const { key : keys, uploadURL: urls } = await getPresignedUrl(fileNames, fileTypes);
            console.log("presigned url : ", urls);

            for (let i = 0; i < selectedFiles.length; i++){
                const file = selectedFiles[i];
                const url = urls[i];

                await uploadToS3(file, url);
            }

            console.log("파일 업로드 성공");
            navigate('/start', {state : {keys, fileTypes, fileNames}});

        }catch(err){
            //아 생각해보니까 이거 presigned랑 AWS랑 나눠야하는데 씨앙
            console.error('업로드 URL(presigned url) 요청 실패 : ', err.message);
            alert(`업로드 중 오류 발생!\n${err.message}`);
            setSelectedFiles([]);
            setClearInput(prev => !prev);
        }
    };

    return (
        <div className="bg-yellow-01 w-screen h-screen flex flex-col items-center justify-center">
            <div className='text-center mb-4 mt-6'>
                <h2 className='text-3xl font-bold py-2 text-black'>PRIBUNNY</h2>
                <p className='py-2 text-black'>개인정보처리방침 및 수집이용동의서 분석 및 요약 서비스</p>
            </div>
            <div>
                <Addfile onFileSelected={setSelectedFiles} clearTrigger={clearInput} />
                <div className="flex justify-center m-4">
                    <div className="flex justify-center mt-4">
                        <button onClick = {handleUpload}
                            className="w-[150px] h-[50px] bg-yellow-02 rounded-2 flex items-center justify-center gap-2 font-bold text-black">
                            <img src={StartIcon} alt="start_icon" className="w-[25px] h-[25px] " />
                            시작하기
                        </button>
                    </div>
                </div>
                <img src={MainImg_file} alt="pri-bunny_ file img" className="w-[350px] h-auto mx-auto"/>
            </div>
        </div>
    );
}