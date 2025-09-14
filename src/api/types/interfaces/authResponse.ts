import type {UserDto} from "./userDto.ts";

export interface AuthResponse {
    token: string;
    user: UserDto;
}
