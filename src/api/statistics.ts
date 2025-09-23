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
    const response = await api.get(`/status`, { params: filter });
    const raw = response.data as any[];
    // Normalize PascalCase (backend) -> camelCase (frontend)
    return (raw ?? []).map((x) => ({
        id: x.id ?? x.Id,
        statusId: x.statusId ?? x.StatusId,
        statusName: x.statusName ?? x.StatusName,
        date: x.date ?? x.Date,
        countRequests: x.countRequests ?? x.CountRequests,
        avgCompletionDays: x.avgCompletionDays ?? x.AvgCompletionDays ?? null,
    })) as StatusStatisticDto[];
};

