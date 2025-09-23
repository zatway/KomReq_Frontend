import type {CreateRequestDto} from './types/interfaces/createRequestDto';
import type {UpdateRequestDto} from "./types/interfaces/updateRequestDto.ts";
import type {ChangeStatusDto} from "./types/interfaces/changeStatusDto.ts";
import type {AssignUserDto} from "./types/interfaces/assignUserDto.ts";
import type {RequestFilterDto} from "./types/interfaces/requestFilterDto.ts";
import type {RequestDto} from "./types/interfaces/requestDto.ts";
import type {RequestHistoryDto} from "./types/interfaces/requestHistoryDto.ts";
import { createApi } from './http';

const API_URL = import.meta.env?.VITE_API_REQUEST_URL || 'http://localhost:5012/api/request';
const api = createApi(API_URL);

export interface RequestStatusDto {
    id: number;
    name: string;
    isFinal: boolean;
}

export interface AddCommentDto {
    comment: string;
}

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
    const raw = response.data as any[];
    // Normalize backend fields to frontend `RequestDto`
    return (raw ?? []).map((r) => ({
        id: r.id ?? r.Id,
        priority: r.priority ?? r.Priority,
        creator: r.creator ?? r.Creator
            ? {
                id: (r.creator?.id ?? r.Creator?.Id) as string,
                userName: (r.creator?.userName ?? r.Creator?.UserName) as string,
                fullName: (r.creator?.fullName ?? r.Creator?.FullName) as string | undefined,
                email: (r.creator?.email ?? r.Creator?.Email) as string | undefined,
            }
            : undefined,
        equipmentType: r.equipment ?? r.Equipment
            ? {
                id: (r.equipment?.id ?? r.Equipment?.Id) as number,
                equipmentName: (r.equipment?.equipmentName ?? r.Equipment?.EquipmentName) as string,
                price: (r.equipment?.price ?? r.Equipment?.Price) as number,
            }
            : undefined,
        currentStatus: r.status ?? r.Status
            ? { name: (r.status?.statusName ?? r.Status?.StatusName ?? r.currentStatus?.name ?? r.CurrentStatus?.Name) as string }
            : r.currentStatus ?? r.CurrentStatus
            ? { name: (r.currentStatus?.name ?? r.CurrentStatus?.Name) as string }
            : undefined,
        quantity: r.quantity ?? r.Quantity,
        createdDate: r.createdDate ?? r.CreatedDate,
        targetCompletion: r.targetCompletion ?? r.TargetCompletion ?? null,
        comments: r.comments ?? r.Comments ?? null,
        currentStatusId: r.currentStatusId ?? r.CurrentStatusId,
        managerId: r.managerId ?? r.ManagerId,
        equipmentTypeId: r.equipmentTypeId ?? r.EquipmentTypeId,
        creatorId: r.creatorId ?? r.CreatorId,
        isActive: r.isActive ?? r.IsActive,
    })) as RequestDto[];
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

export const getRequestStatuses = async (): Promise<RequestStatusDto[]> => {
    // Use absolute path to avoid double-prefixing with request base URL
    const response = await api.get<RequestStatusDto[]>(`http://localhost:5012/api/request-status`);
    return response.data;
};

export const addComment = async (id: number, data: AddCommentDto): Promise<{ message: string }> => {
    const response = await api.post(`/${id}/add-comment`, data);
    return response.data;
};
