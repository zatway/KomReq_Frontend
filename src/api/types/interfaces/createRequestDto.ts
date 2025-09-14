export interface CreateRequestDto {
    clientId: number;
    equipmentTypeId: number;
    quantity: number;
    priority: RequestPriority;
    targetCompletion?: string | null; // ISO date string
    comments?: string | null;
}
