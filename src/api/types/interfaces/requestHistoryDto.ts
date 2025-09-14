export interface RequestHistoryDto {
    id: number;
    requestId: number;
    oldStatusId?: number | null;
    newStatusId: number;
    changedByUserId: string;
    changeDate: string;
    comment?: string | null;
}
