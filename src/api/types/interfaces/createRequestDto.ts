import type {RequestPriorityDto} from '../types/RequestPriority.ts';

export interface CreateRequestDto {
    clientId: number;
    equipmentTypeId: number;
    quantity: number;
    priority: RequestPriorityDto;
    targetCompletion?: string | null; // ISO date string
    comments?: string | null;
}
