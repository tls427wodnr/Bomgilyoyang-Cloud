import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {},
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isAuthRequest = originalRequest?.url?.startsWith('/api/auth/login')
            || originalRequest?.url?.startsWith('/api/auth/signup')
            || originalRequest?.url?.startsWith('/api/auth/refresh');

        if (isUnauthorized && !isAuthRequest && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/api/auth/refresh');
                return api(originalRequest);
            } catch {
                // 갱신에도 실패하면 원래 401 응답을 그대로 전달한다.
            }
        }

        return Promise.reject(error);
    }
);

export default api;
