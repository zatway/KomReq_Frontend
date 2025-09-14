export interface UserDto {
    id: string;
    userName: string;
    email?: string;
    fullName?: string;
    isActive?: boolean;
    roles?: string[];
}
