export interface UpdateRequestDto {
    quantity: number;
    priority: RequestPriority;
    targetCompletion?: string | null;
    comments?: string | null;
    equipmentTypeId?: number;
}
