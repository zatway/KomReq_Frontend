export interface RequestHistoryDto {
    id: number;
    requestId: number;
    oldStatus?: { id: number; statusName: string } | null;
    newStatus: { id: number; statusName: string };
    changedBy?: { id: string; fullName: string } | null;
    changeDate: string;
    comment?: string | null;
    fieldChanged?: string | null;
}
