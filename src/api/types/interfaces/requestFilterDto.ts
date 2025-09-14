export interface RequestFilterDto {
    statusId?: number;
    clientId?: number;
    priority?: RequestPriority;
    startDate?: string;
    endDate?: string;
}
