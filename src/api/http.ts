import axios from "axios";

export const createApi = (baseURL?: string) => {
    const api = axios.create({ baseURL });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                // Не очищаем токен автоматически, просто пробрасываем ошибку
            }
            return Promise.reject(error);
        }
    );

    return api;
};
