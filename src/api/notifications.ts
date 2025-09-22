import { createApi } from './http';

const API_URL = import.meta.env?.VITE_API_NOTIFICATIONS_URL || 'http://localhost:5012/api/notification';

const api = createApi(API_URL);

export interface NotificationDto {
    id: number;
    requestId: number | null;
    requestSubject: string | null;
    type: string;
    message: string;
    sentDate: string;
    isRead: boolean;
}

export const getMyNotifications = async (unreadOnly: boolean = false): Promise<NotificationDto[]> => {
    const response = await api.get<NotificationDto[]>(`/`, { params: { unreadOnly } });
    return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
    await api.post(`/${id}/mark-read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.post(`/mark-all-read`);
};

