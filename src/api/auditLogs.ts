import { createApi } from './http';

const API_URL = import.meta.env?.VITE_API_AUDIT_LOGS_URL || 'http://localhost:5012/api/audit-log';

const api = createApi(API_URL);

export interface AuditLogDto {
    id: number;
    userId: string;
    userName: string;
    userFullName: string;
    action: string;
    entityId: number | null;
    entityType: string | null;
    details: string | null;
    ipAddress: string | null;
    timestamp: string;
}

export interface AuditLogFilter {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
}

export const getAuditLogs = async (filter?: AuditLogFilter): Promise<AuditLogDto[]> => {
    const response = await api.get<AuditLogDto[]>(`/`, { params: filter });
    return response.data;
};

export const getAuditLogById = async (id: number): Promise<AuditLogDto> => {
    const response = await api.get<AuditLogDto>(`/${id}`);
    return response.data;
};

