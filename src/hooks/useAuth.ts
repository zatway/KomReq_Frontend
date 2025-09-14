import { AuthApi } from '../api';
import type {RegisterModel} from "../api/types/interfaces/registerModel.ts";
import type {ChangePasswordModel} from "../api/types/interfaces/changePasswordModel.ts";
import type {ChangeRoleModel} from "../api/types/interfaces/changeRoleModel.ts";

export const useAuth = () => {
    const authContext = useAuth();

    const register = async (model: RegisterModel) => {
        const response = await AuthApi.register(model);
        return response.message;
    };

    const changePassword = async (model: ChangePasswordModel) => {
        const response = await AuthApi.changePassword(model);
        return response.message;
    };

    const changeRole = async (model: ChangeRoleModel) => {
        const response = await AuthApi.changeRole(model);
        return response.message;
    };

    const getUsers = async () => {
        return await AuthApi.getUsers();
    };

    return {
        ...authContext,
        register,
        changePassword,
        changeRole,
        getUsers,
    };
};
