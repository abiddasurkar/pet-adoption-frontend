import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Check if token exists on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
    }, []);

    // Signup function
    const signup = async (email, password, name, phone, address) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, {
                email,
                password,
                name,
                phone,
                address,
            });

            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            setIsLoggedIn(true);

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true, data: userData };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Signup failed';
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
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            setIsLoggedIn(true);

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true, data: userData };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Check if user has admin role
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                error,
                isLoggedIn,
                isAdmin,
                signup,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
