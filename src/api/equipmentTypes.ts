import {createApi} from './http';

const API_URL = import.meta.env?.VITE_API_EQUIPMENT_TYPES_URL || 'http://localhost:5012/api/equipment-type';

const api = createApi(API_URL);

export interface EquipmentTypeDto {
    id: number;
    name: string;
    description: string | null;
    specifications: string | null;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreateEquipmentTypeDto {
    name: string;
    description?: string | null; // Allow null
    specifications?: string | null; // Allow null
    price: number;
    isActive?: boolean;
}

export interface UpdateEquipmentTypeDto {
    name?: string;
    description?: string | null; // Allow null
    specifications?: string | null; // Allow null
    price?: number;
    isActive?: boolean;
}

export const getEquipmentTypes = async (): Promise<EquipmentTypeDto[]> => {
    const response = await api.get<EquipmentTypeDto[]>(`/all`); // Changed to /all for admin view
    return response.data;
};

export const getEquipmentTypeById = async (id: number): Promise<EquipmentTypeDto> => {
    const response = await api.get<EquipmentTypeDto>(`/${id}`);
    return response.data;
};

export const createEquipmentType = async (data: CreateEquipmentTypeDto): Promise<EquipmentTypeDto> => {
    const response = await api.post<EquipmentTypeDto>(`/`, data);
    return response.data;
};

export const updateEquipmentType = async (id: number, data: UpdateEquipmentTypeDto): Promise<void> => {
    await api.put(`/${id}`, data);
};

export const deleteEquipmentType = async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
};
