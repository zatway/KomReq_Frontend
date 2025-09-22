export interface RequestDto {
    id: number;
    priority: string;
    // Поля для экрана списка (нормализованные)
    client?: { fullName: string };
    equipmentType: { name: string };
    currentStatus: { name: string };
    // Прочие возможные поля, если где-то нужны
    clientId?: number;
    equipmentTypeId?: number;
    quantity?: number;
    createdDate?: string;
    targetCompletion?: string | null;
    managerId?: string | null;
    currentStatusId?: number;
    comments?: string | null;
    isActive?: boolean;
}
