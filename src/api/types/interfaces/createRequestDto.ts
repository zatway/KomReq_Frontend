import type {RequestPriorityDto} from '../types/RequestPriority.ts';

export interface CreateRequestDto {
    // clientId: number;
    clientUserId?: string;
    equipmentTypeId: number;
    quantity: number;
    priority: RequestPriorityDto;
    targetCompletion?: string | null; // ISO date string
    comments?: string | null;
}
