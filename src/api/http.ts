import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token?: string | null) => {
    authToken = token ?? null;
};

export const createApi = (baseURL: string) => {
    const api = axios.create({ baseURL });

    api.interceptors.request.use((config) => {
        if (authToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    });

    return api;
};

// экземпляры для разных зон
export const authApi = createApi(import.meta.env.VITE_API_AUTH_URL);
export const requestApi = createApi(import.meta.env.VITE_API_REQUEST_URL);
