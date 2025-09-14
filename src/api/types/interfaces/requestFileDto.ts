export interface RequestFileDto {
    id: number;
    requestId: number;
    filePath: string;
    fileName: string;
    fileType?: string | null;
    description?: string | null;
    uploadedByUserId: string;
    uploadedDate: string;
    isConfidential: boolean;
}
