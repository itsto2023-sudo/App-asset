
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import * as api from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('jwt_token'));

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            // In a real app, you'd validate the token here.
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('jwt_token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        api.logout(); // This is just for clearing the mock token
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
    };

    const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
