import type {CreateRequestDto} from './types/interfaces/createRequestDto';
import type {UpdateRequestDto} from "./types/interfaces/updateRequestDto.ts";
import type {ChangeStatusDto} from "./types/interfaces/changeStatusDto.ts";
import type {AssignUserDto} from "./types/interfaces/assignUserDto.ts";
import type {RequestFilterDto} from "./types/interfaces/requestFilterDto.ts";
import type {RequestDto} from "./types/interfaces/requestDto.ts";
import type {RequestHistoryDto} from "./types/interfaces/requestHistoryDto.ts";
import { createApi } from './http';

const API_URL = (import.meta as any).env?.VITE_API_REQUEST_URL || 'http://localhost:5012/api/request';
const api = createApi(API_URL);

// Создание заявки (Manager)
export const createRequest = async (data: CreateRequestDto): Promise<{ message: string; requestId: number }> => {
    const response = await api.post(`/create`, data);
    return response.data;
};

// Обновление заявки (Manager)
export const updateRequest = async (id: number, data: UpdateRequestDto): Promise<{ message: string }> => {
    const response = await api.put(`/${id}`, data);
    return response.data;
};

// Изменение статуса заявки (Manager, Technician)
export const changeStatus = async (id: number, data: ChangeStatusDto): Promise<{ message: string }> => {
    const response = await api.put(`/${id}/status`, data);
    return response.data;
};

// Назначение сотрудника на заявку (Manager)
export const assignUser = async (id: number, data: AssignUserDto): Promise<{ message: string }> => {
    const response = await api.post(`/${id}/assign`, data);
    return response.data;
};

// Загрузка файла к заявке (Manager, Technician)
export const uploadFile = async (id: number, data: FormData): Promise<{ message: string; fileId: number }> => {
    const response = await api.post(`/${id}/files`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Получение информации о заявке (All roles)
export const getRequest = async (id: number): Promise<RequestDto> => {
    const response = await api.get(`/${id}`);
    return response.data;
};

// Получение списка заявок с фильтрацией (All roles)
export const getRequests = async (filter: RequestFilterDto): Promise<RequestDto[]> => {
    const response = await api.get(`/`, { params: filter });
    return response.data;
};

// Получение истории заявки (All roles)
export const getRequestHistory = async (id: number): Promise<RequestHistoryDto[]> => {
    const response = await api.get(`/${id}/history`);
    return response.data;
};

// Удаление заявки (Admin)
export const deleteRequest = async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/${id}`);
    return response.data;
};
