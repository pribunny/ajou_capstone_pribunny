import axios from 'axios';
const apiClient = axios.create({
    baseURL: 'https://pribuddy.shop',//process.env.REACT_APP_API_BASE_URL, // 공통 URL 설정
    headers: {
    'Content-Type': 'application/json'  // ✅ 명시적으로 설정
    },
    //timeout: 5000, // 요청 제한 시간
});
// Axios 요청/응답 로깅 설정
apiClient.interceptors.request.use((config) => {
    console.log('Request sent:', config);
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});
apiClient.interceptors.response.use((response) => {
    console.log('Response received:', response);
    return response;
}, (error) => {
    console.error('Response error:', error.response || error);
    return Promise.reject(error);
});

export default apiClient;