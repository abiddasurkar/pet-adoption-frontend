import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { USER_ROLES } from '../services/api/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if token exists on mount
    useEffect(() => {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
            setIsLoggedIn(true);
        }
    }, []);

    // Clear error
    const clearError = () => setError(null);

    // Signup function
    const signup = async (email, password, name, phone, address) => {
        setIsLoading(true);
        setError(null);
        try {
            const { token: newToken, user: userData } = await authService.signup(
                email, password, name, phone, address
            );

            setToken(newToken);
            setUser(userData);
            setIsLoggedIn(true);

            authService.storeAuthData(newToken, userData);

            return { success: true, data: userData };
        } catch (err) {
            const errorMsg = err.message;
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const { token: newToken, user: userData } = await authService.login(email, password);

            setToken(newToken);
            setUser(userData);
            setIsLoggedIn(true);

            authService.storeAuthData(newToken, userData);

            return { success: true, data: userData };
        } catch (err) {
            const errorMsg = err.message;
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            setIsLoggedIn(false);
        }
    };

    // Check if user has admin role
    const isAdmin = user?.role === USER_ROLES.ADMIN;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                error,
                isLoggedIn,
                isAdmin,
                clearError,
                signup,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};