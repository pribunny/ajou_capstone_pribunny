//s3에 파일 업로드

import apiClient from './apiClient';
import * as config from '../config';

const USE_MOCK = true;

// 서버로 pre-signed url을 요청하는 로직
export const getPresignedUrl = async(filename, filetype) => {

    try{
        const response = await apiClient.post('/api/files/presign', //여기 서버랑 얘기해서 수정
            {
                filename : filename,
                contentType : filetype
            });
        if(response?.status === 200) return response.data.data.uploadURL; //{url, key} 형식으로 데이터가 반환된다고 생각
    }catch(err){
        if(err.response?.status === 400){
            const error = new Error('에러에 관한 설명');
            error.code = 'Bad Request';
            throw error;
        }
        if(err.response?.status === 401){}
        if(err.response?.status === 408){}
    }
};

//서버로부터 받은 pre-signed url을 이용해서 S3에 직접 업로드 (이건 fetch로 해야됨)
export const uploadToS3 = async(file, presignedUrl) => {

    try{
        const response = await fetch(presignedUrl, {
            method : 'PUT',
            headers : {'Content-Type' : file.type},
            body : file,
        });

        if(!response.ok) throw new Error(`S3 업로드 실패 : ${response.status}`);
        return true;
    }catch(err){
        console.error('uploadToS3 error', err);
        throw err;
    }
};

//pre-signed url 이용해서 업로드 성공했을 때 서버로 요청(key) 보내기
export const notifyServer = async(filename, filetype) => {
    try{
        const response = await apiClient.post('/api/analyze', //여기도 임의로 작성한 url
            {filename, filetype});

        if(response?.status === 200) return response.data;
    }catch(err){
        console.error('notifyServer error', err);
        if(err.response?.status === 400){
            const error = new Error('에러에 관한 설명');
            error.code = 'Bad Request';
            throw error;
        }
        if(err.response?.status === 401){}
        if(err.response?.status === 408){}
    }
};