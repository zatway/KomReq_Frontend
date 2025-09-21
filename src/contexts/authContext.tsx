import React, {createContext, type ReactNode, useEffect, useState} from 'react';
import type {UserDto} from "../api/types/interfaces/userDto.ts";

interface AuthContextType {
    user: UserDto | null;
    setUser: (user: UserDto | null) => void;
    isAuthenticated: boolean;
    hasRole: (role: string) => boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserDto | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const isAuthenticated = !!user && !!localStorage.getItem('token');

    const hasRole = (role: string) => {
        return user?.roles?.values?.includes(role) || false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{user, setUser, isAuthenticated, hasRole, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

