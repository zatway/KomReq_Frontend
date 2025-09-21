import axios from 'axios';
import type {CreateRequestDto} from './types/interfaces/createRequestDto';
import type {UpdateRequestDto} from "./types/interfaces/updateRequestDto.ts";
import type {ChangeStatusDto} from "./types/interfaces/changeStatusDto.ts";
import type {AssignUserDto} from "./types/interfaces/assignUserDto.ts";
import type {RequestFilterDto} from "./types/interfaces/requestFilterDto.ts";
import type {RequestDto} from "./types/interfaces/requestDto.ts";
import type {RequestHistoryDto} from "./types/interfaces/requestHistoryDto.ts";

const API_URL = 'http://localhost:5012/api/request'; // Замените на реальный URL вашего API

// Хелпер для получения токена из localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
};

// Создание заявки (Manager)
export const createRequest = async (data: CreateRequestDto): Promise<{ message: string; requestId: number }> => {
    const response = await axios.post(`${API_URL}/create`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Обновление заявки (Manager)
export const updateRequest = async (id: number, data: UpdateRequestDto): Promise<{ message: string }> => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Изменение статуса заявки (Manager, Technician)
export const changeStatus = async (id: number, data: ChangeStatusDto): Promise<{ message: string }> => {
    const response = await axios.put(`${API_URL}/${id}/status`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Назначение сотрудника на заявку (Manager)
export const assignUser = async (id: number, data: AssignUserDto): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/${id}/assign`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Загрузка файла к заявке (Manager, Technician)
export const uploadFile = async (id: number, data: FormData): Promise<{ message: string; fileId: number }> => {
    const response = await axios.post(`${API_URL}/${id}/files`, data, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Получение информации о заявке (All roles)
export const getRequest = async (id: number): Promise<RequestDto> => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Получение списка заявок с фильтрацией (All roles)
export const getRequests = async (filter: RequestFilterDto): Promise<RequestDto[]> => {
    const response = await axios.get(`${API_URL}`, {
        headers: getAuthHeader(),
        params: filter,
    });
    return response.data;
};

// Получение истории заявки (All roles)
export const getRequestHistory = async (id: number): Promise<RequestHistoryDto[]> => {
    const response = await axios.get(`${API_URL}/${id}/history`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Удаление заявки (Admin)
export const deleteRequest = async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
