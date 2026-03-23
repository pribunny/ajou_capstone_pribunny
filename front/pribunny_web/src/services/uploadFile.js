//s3에 파일 업로드

import apiClient from './apiClient';

// 서버로 pre-signed url을 요청하는 로직
export const getPresignedUrl = async(filenames, filetypes) => {
    try{
        const response = await apiClient.post('/api/files/presign',
            {
                filename : filenames,
                contentType : filetypes
            });
        if(response?.status === 200) return response.data.data;

    }catch(err){
        console.error('getPresignedUrl error', err);
        const error = new Error();
        const status = err.response?.status;
        const errorCode = err.response?.data?.code;

        if(!err.response){
            error.message = '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요';
        }else{
            switch(errorCode){
                case 'MISSING_PARAMETERS':
                    error.message = '업로드할 파일 정보가 누락되었습니다. 다시 시도해주세요.';
                    break;
                case 'BAD_REQUEST':
                    error.message = '파일 선택에 문제가 있습니다. 파일을 5개 이하로 선택했는지 확인해주세요.';
                    break;
                case 'NO_VALID_FILES':
                    error.message = '지원하지 않는 파일 형식입니다. PDF 또는 이미지 파일(PNG, JPG, JPEG)만 업로드할 수 있어요.';
                    break;
                case 'S3_PRESIGN_FAILED':
                    error.message = '파일 업로드 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                    break;
                default :
                    error.message = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            }
        }
        throw error;
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
        const error = new Error();
        const status = err.response?.status;
        const errorCode = err.response?.data?.code;

        if(!err.response){
            error.message = '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요';
        }else{
            error.message = '파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.'
        }
        throw error;
    }
};

//pre-signed url 이용해서 업로드 성공했을 때 서버로 요청(key) 보내기
export const notifyServer = async(keys, filetypes) => {
    try{
        const response = await apiClient.post('/api/analyze',
            {
                filename :keys,
                filetype : filetypes
            });

        if(response?.status === 200) return response.data.data.results;

    }catch(err){
        console.error('notifyServer error', err);
        const error = new Error();
        const status = err.response?.status;
        const errorCode = err.response?.data?.code;

        if(!err.response){
            error.message = '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요';
        }else{
            switch(errorCode){
                case 'INVALID_PARAMS':
                    error.message = '파일 정보를 제대로 전달하지 못했습니다. 다시 시도해주세요.';
                    break;
                case 'TOO_MANY_FILES':
                    error.message = '한 번에 업로드할 수 있는 파일은 최대 5개입니다.';
                    break;
                case 'UNSUPPORTED_FILETYPE':
                    error.message = '지원하지 않는 파일 형식입니다. PDF 또는 이미지 파일(PNG, JPG, JPEG)만 업로드할 수 있습니다.';
                    break;
                case 'UNKNOWN_FILETYPE':
                    error.message = '파일의 형식을 확인할 수 없습니다. 올바른 형식의 파일인지 확인해주세요.';
                    break;
                case 'MISMATCH_FILETYPE':
                    error.message = '파일 형식이 실제 내용과 일치하지 않습니다. 다시 확인해주세요.';
                    break;
                case 'EXTENSION_MISMATCH':
                    error.message = '파일 확장자가 실제 파일 형식과 다릅니다. 올바른 확장자를 사용해주세요.';
                    break;
                case 'MULTIPLE_PDFS_NOT_ALLOWED':
                    error.message = 'PDF 파일은 한 번에 하나만 업로드할 수 있습니다.';
                    break;
                case 'OCR_FAIL':
                    error.message = '일부 이미지에서 텍스트를 읽지 못했습니다. 더 선명한 이미지를 사용해주세요.';
                    break;
                case 'MARKDOWN_CONVERT_FAIL':
                    error.message = '파일에서 내용을 추출 후 분석을 할 수 없습니다. 다른 파일도 시도해주세요.';
                    break;
                case 'SUMMARY_FAIL':
                    error.message = '요약 처리 중 문제가 발생했습니다. 나중에 다시 시도해주세요.';
                    break;
                case 'UNFAIRDETECT_FAIL':
                    error.message = '약관 탐지 중 문제가 발생했습니다. 나중에 다시 시도해주세요.';
                    break;
                case 'SERVER_ERROR':
                    error.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                    break;
                default :
                    error.message = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            }
        }
        throw error;
    }
};