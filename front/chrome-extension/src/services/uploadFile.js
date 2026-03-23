import apiClient from './apiClient';

export const getPresigned = async(filename, filetype) => {
    try {
        const response = await apiClient.post('/api/text/presign',
            {
                filename : filename,
                contentType : filetype
            }
        );
            if (response?.status === 200) return response.data.data; //여기 수정 필요함
        } catch (err) {
            const status = err.response?.status;
            const error = new Error();

            if (!err.response) {
                error.message = '요약 처리 실패 (네트워크 오류)';
                error.code = 'NETWORK_ERR';
            } else {
                switch (status) {
                case 400:
                    error.message = '요약할 텍스트가 필요합니다.';
                    error.code = 'NO_TEXT';
                    break;
                case 422:
                    error.message = '요청 형식이 올바르지 않습니다.';
                    error.code = 'FORMAT_ERR';
                    break;
                case 500:
                    error.message = '요약 처리 실패 (서버 내부 오류)';
                    error.code = 'SERVER_ERR';
                    break;
                case 408:
                    error.message = '요청이 타임아웃되었습니다.';
                    error.code = 'TIMEOUT';
                    break;
                case 404:
                case 405:
                    error.message = '잘못된 HTTP 요청입니다.';
                    error.code = 'HTTP_ERR';
                    break;
                default:
                    error.message = `요약 처리 실패 (알 수 없는 오류: ${status})`;
                    error.code = 'UNKNOWN';
            }
        }
        throw error;
    }
};


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