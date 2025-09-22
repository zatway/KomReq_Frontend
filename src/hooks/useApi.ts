import { useState } from 'react';
import axios from 'axios';
import {useSnackbar} from '../contexts/snackbarContext';

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
    const { showMessage } = useSnackbar();

    const execute = async (apiCall: () => Promise<T>, successMessage?: string) => {
        setResponse({ data: null, loading: true, error: null });
        try {
            const data = await apiCall();
            setResponse({ data, loading: false, error: null });
            if (successMessage) showMessage(successMessage, 'success');
            return data;
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.Message || error.message
                : 'Неизвестная ошибка';
            setResponse({ data: null, loading: false, error: errorMessage });
            showMessage(errorMessage, 'error');
            throw error;
        }
    };

    return { ...response, execute };
};
