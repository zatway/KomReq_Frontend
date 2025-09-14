import { authApi, setAuthToken } from "./http";
import type {LoginModel} from "./types/interfaces/loginModel.ts";
import type {UserDto} from "./types/interfaces/userDto.ts";
import type {AuthResponse} from "./types/interfaces/authResponse.ts";
import type {RegisterModel} from "./types/interfaces/registerModel.ts";
import type {ChangePasswordModel} from "./types/interfaces/changePasswordModel.ts";
import type {ChangeRoleModel} from "./types/interfaces/changeRoleModel.ts";

export { setAuthToken };

export const register = async (model: RegisterModel) => {
    const res = await authApi.post("/register", model);
    return res.data as { message: string };
};

export const login = async (model: LoginModel) => {
    const res = await authApi.post("/login", model);
    const data = res.data;
    const token = data.token ?? data.Token;
    const user = data.user as UserDto;
    return { token, user } as AuthResponse;
};

export const getUsers = async () => {
    const res = await authApi.get("/users");
    return res.data as UserDto[];
};

export const createUser = async (model: RegisterModel) => {
    const res = await authApi.post("/create-user", model);
    return res.data as { message: string };
};

export const deleteUser = async (id: string) => {
    const res = await authApi.delete(`/delete-user/${encodeURIComponent(id)}`);
    return res.data as { message: string };
};

export const changePassword = async (model: ChangePasswordModel) => {
    const res = await authApi.post("/change-password", model);
    return res.data as { message: string };
};

export const changeRole = async (model: ChangeRoleModel) => {
    const res = await authApi.post("/change-role", model);
    return res.data as { message: string };
};
