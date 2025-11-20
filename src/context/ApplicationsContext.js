import React, { createContext, useState } from 'react';
import axios from 'axios';

export const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
    const [userApplications, setUserApplications] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Get user's applications
    const getUserApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/applications/my`);
            setUserApplications(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to fetch applications';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Get all applications (admin only)
    const getAllApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/applications`);
            setAllApplications(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to fetch applications';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Apply for adoption
    const applyForAdoption = async (petId, message) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/api/applications`, {
                petId,
                userMessage: message,
            });
            setUserApplications([...userApplications, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to apply for adoption';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Admin: Approve application
    const approveApplication = async (appId, notes) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_URL}/api/applications/${appId}/approve`, {
                adminNotes: notes,
            });
            const updatedApps = allApplications.map((app) => (app._id === appId ? response.data : app));
            setAllApplications(updatedApps);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to approve application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // Admin: Reject application
    const rejectApplication = async (appId, notes) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${API_URL}/api/applications/${appId}/reject`, {
                adminNotes: notes,
            });
            const updatedApps = allApplications.map((app) => (app._id === appId ? response.data : app));
            setAllApplications(updatedApps);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to reject application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    // User: Withdraw application
    const withdrawApplication = async (appId) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_URL}/api/applications/${appId}`);
            setUserApplications(userApplications.filter((app) => app._id !== appId));
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to withdraw application';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ApplicationsContext.Provider
            value={{
                userApplications,
                allApplications,
                isLoading,
                error,
                getUserApplications,
                getAllApplications,
                applyForAdoption,
                approveApplication,
                rejectApplication,
                withdrawApplication,
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    );
};
