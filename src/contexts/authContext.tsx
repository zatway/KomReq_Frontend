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
            const raw = JSON.parse(storedUser);
            const normalized = {
                ...raw,
                roles: {
                    values: raw?.roles?.values ?? raw?.roles?.$values ?? raw?.roles ?? (raw as any)?.Roles ?? []
                }
            } as UserDto;
            setUser(normalized);
        }
        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'token' || event.key === 'user') {
                const nextUser = localStorage.getItem('user');
                if (!nextUser) {
                    setUser(null);
                    return;
                }
                const raw = JSON.parse(nextUser);
                const normalized = {
                    ...raw,
                    roles: {
                        values: raw?.roles?.values ?? raw?.roles?.$values ?? raw?.roles ?? (raw as any)?.Roles ?? []
                    }
                } as UserDto;
                setUser(normalized);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const isAuthenticated = !!localStorage.getItem('token');

    const hasRole = (role: string) => {
        console.log(user);
        console.log(user?.roles)
        const roles = user?.roles ?? [];
        return roles?.includes(role);
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

