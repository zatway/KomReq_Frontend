import {createContext, type ReactNode, useContext, useState} from 'react';
import { AuthApi, setAuthToken } from '../api';
import type {UserDto} from "../api/types/interfaces/userDto.ts";
import type { LoginModel } from '../api/types/interfaces/loginModel.ts';
import type {AuthResponse} from "../api/types/interfaces/authResponse.ts";

interface AuthContextType {
    user: UserDto | null;
    login: (model: LoginModel) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);

    const login = async (model: LoginModel) => {
        const response: AuthResponse = await AuthApi.login(model);
        setAuthToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
