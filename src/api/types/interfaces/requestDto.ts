export interface RequestDto {
    id: number;
    clientId: number;
    equipmentTypeId: number;
    quantity: number;
    priority: RequestPriority;
    createdDate: string;
    targetCompletion?: string | null;
    managerId?: string | null;
    currentStatusId: number;
    comments?: string | null;
    isActive: boolean;
}
