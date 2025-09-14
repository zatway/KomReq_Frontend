export interface UploadFileDto {
    file: File;
    description?: string | null;
    isConfidential?: boolean;
}
