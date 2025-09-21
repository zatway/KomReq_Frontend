import axios from 'axios';
import type { RegisterModel } from './types/interfaces/registerModel';
import type { AuthResponse } from './types/interfaces/authResponse';
import type { LoginModel } from './types/interfaces/loginModel';
import type { UserDto } from './types/interfaces/userDto';
import type { ChangePasswordModel } from './types/interfaces/changePasswordModel';
import type { ChangeRoleModel } from './types/interfaces/changeRoleModel';

const API_URL = 'http://localhost:5012/api/auth'; // Замените на реальный URL вашего API

// Хелпер для получения токена из localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Регистрация пользователя
export const register = async (data: RegisterModel): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    return response.data;
};

// Вход в систему
export const login = async (data: LoginModel): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// Получение списка пользователей (Admin)
export const getUsers = async (): Promise<UserDto[]> => {
    const response = await axios.get<UserDto[]>(`${API_URL}/users`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Создание пользователя (Admin)
export const createUser = async (data: RegisterModel): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL}/create-user`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Удаление пользователя
export const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`${API_URL}/delete-user/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Смена пароля
export const changePassword = async (data: ChangePasswordModel): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL}/change-password`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};

// Смена роли (Admin)
export const changeRole = async (data: ChangeRoleModel): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL}/change-role`, data, {
        headers: getAuthHeader(),
    });
    return response.data;
};
