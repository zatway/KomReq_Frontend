import { createApi } from './http';

const API_URL = import.meta.env?.VITE_API_STATISTICS_URL || 'http://localhost:5012/api/statistic';

const api = createApi(API_URL);

export interface StatusStatisticDto {
    id: number;
    statusId: number;
    statusName: string;
    date: string;
    countRequests: number;
    avgCompletionDays: number | null;
}

export interface StatusStatisticFilter {
    startDate?: string;
    endDate?: string;
}

export const getStatusStatistics = async (filter?: StatusStatisticFilter): Promise<StatusStatisticDto[]> => {
    const response = await api.get<StatusStatisticDto[]>(`/status`, { params: filter });
    return response.data;
};

