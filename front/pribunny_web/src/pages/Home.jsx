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
    console.log("선택된 파일 : ", selectedFiles.length);

    const handleUpload = async() => {
        try{
            if(selectedFiles.length === 0){
                alert("파일을 업로드해주세요.");
                return;
            }

            for(const file of selectedFiles){
                console.log("file name : ", file.name);
                console.log("file type : ", file.type);
                const url = await getPresignedUrl(file.name, file.type);
                console.log("url : ", url)
                await uploadToS3(file, url);
                console.log("서버 전송시작");
                await notifyServer(file.name, file.type);
            }

            console.log("파일 업로드 성공");
            navigate('/start');

        }catch(err){
            console.error(err);
            alert("업로드 중 오류 발생!");
        }
    };

    return (
        <div className="bg-yellow-01 w-screen h-screen flex flex-col items-center justify-center">
            <div className='text-center mb-4 mt-6'>
                <h2 className='text-3xl font-bold py-2'>PRIBUNNY</h2>
                <p className='py-2'>개인정보처리방침 및 수집이용동의서 분석 및 요약 서비스</p>
            </div>
            <div>
                <Addfile onFileSelected={setSelectedFiles} />
                <div className="flex justify-center m-4">
                    <div className="flex justify-center mt-4">
                        <button onClick={() => navigate('/start')}
                            className="w-[150px] h-[50px] bg-yellow-02 rounded-2 flex items-center justify-center gap-2 font-bold">
                            <img src={StartIcon} alt="start_icon" className="w-[25px] h-[25px]" />
                            시작하기
                        </button>
                    </div>
                </div>
                <img src={MainImg_file} alt="pri-bunny_ file img" className="w-[350px] h-auto mx-auto"/>
            </div>
        </div>
    );
}