import { createApi } from './http';
import type { RequestPriorityDto } from './types/types/RequestPriority';

const API_URL = import.meta.env?.VITE_API_REPORTS_URL || 'http://localhost:5012/api/report';

const api = createApi(API_URL);

export interface ReportFilterDto {
    statusId?: number;
    priority?: RequestPriorityDto;
    startDate?: string;
    endDate?: string;
    clientUserId?: string;
}

export const generateRequestsReportPdf = async (filter?: ReportFilterDto): Promise<Blob> => {
    const response = await api.get<Blob>(`/requests-pdf`, { params: filter, responseType: 'blob' });
    return response.data;
};

export const generateRequestsReportExcel = async (filter?: ReportFilterDto): Promise<Blob> => {
    const response = await api.get<Blob>(`/requests-excel`, { params: filter, responseType: 'blob' });
    return response.data;
};