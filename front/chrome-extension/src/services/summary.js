import apiClient from './apiClient';

export const getSummarize = async(input_data, type) => {
    try{
        const response = await apiClient.post('/api/summary',
        {input_data}, { params: { data_size : {type} } });
        if(response?.status === 200) return response.data.data;
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