export interface ChangePasswordModel {
    userId: string;
    currentPassword?: string | null;
    newPassword: string;
}
