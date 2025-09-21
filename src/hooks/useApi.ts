import { useState } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export const useApi = <T>() => {
    const [response, setResponse] = useState<ApiResponse<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = async (apiCall: () => Promise<T>) => {
        setResponse({ data: null, loading: true, error: null });
        try {
            const data = await apiCall();
            setResponse({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.Message || error.message
                : 'Неизвестная ошибка';
            setResponse({ data: null, loading: false, error: errorMessage });
            throw error;
        }
    };

    return { ...response, execute };
};
