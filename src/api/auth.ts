import type { RegisterModel } from './types/interfaces/registerModel';
import type { AuthResponse } from './types/interfaces/authResponse';
import type { LoginModel } from './types/interfaces/loginModel';
import type { UserDto } from './types/interfaces/userDto';
import type { ChangePasswordModel } from './types/interfaces/changePasswordModel';
import type { ChangeRoleModel } from './types/interfaces/changeRoleModel';
import { createApi } from './http';

const API_URL = (import.meta as any).env?.VITE_API_AUTH_URL || 'http://localhost:5012/api/auth';

const api = createApi(API_URL);

// Регистрация пользователя
export const register = async (data: RegisterModel): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/register`, data);
    return response.data;
};

// Вход в систему
export const login = async (data: LoginModel): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/login`, data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Получение списка пользователей (Admin)
export const getUsers = async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>(`/users`);
    return response.data;
};

// Создание пользователя (Admin)
export const createUser = async (data: RegisterModel): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/create-user`, data);
    return response.data;
};

// Удаление пользователя
export const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/delete-user/${id}`);
    return response.data;
};

// Смена пароля
export const changePassword = async (data: ChangePasswordModel): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/change-password`, data);
    return response.data;
};

// Смена роли (Admin)
export const changeRole = async (data: ChangeRoleModel): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/change-role`, data);
    return response.data;
};
