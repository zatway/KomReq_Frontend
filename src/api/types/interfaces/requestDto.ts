export interface RequestDto {
    id: number;
    priority: string;
    // Поля для экрана списка (нормализованные)
    creator?: { id: string; userName: string; fullName?: string; email?: string }; // Изменено с client на creator
    equipmentType: { id: number; equipmentName: string; price: number };
    currentStatus: { name: string };
    // Прочие возможные поля, если где-то нужны
    // clientId?: number; // Удалено
    creatorId?: string; // Добавлено
    equipmentTypeId?: number;
    quantity?: number;
    createdDate?: string;
    targetCompletion?: string | null;
    managerId?: string | null;
    currentStatusId?: number;
    comments?: string | null;
    isActive?: boolean;
}
