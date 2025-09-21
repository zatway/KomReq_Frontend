export interface UserDto {
    id: string;
    userName: string;
    email?: string;
    fullName?: string;
    isActive?: boolean;
    roles?: {
        values: string[]
    }
}
