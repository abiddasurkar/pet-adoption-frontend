import React, { createContext, useState } from 'react';
import { applicationsService } from '../services/api';

export const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
    const [userApplications, setUserApplications] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clear error
    const clearError = () => setError(null);

    // Get user's applications
    const getUserApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const applications = await applicationsService.getUserApplications();
            setUserApplications(applications);
            return applications;
        } catch (err) {
            const errorMsg = err.message;
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all applications (admin only)
    const getAllApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const applications = await applicationsService.getAllApplications();
            setAllApplications(applications);
            return applications;
        } catch (err) {
            const errorMsg = err.message;
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Apply for adoption
    const applyForAdoption = async (petId, message) => {
        setIsLoading(true);
        setError(null);
        try {
            const application = await applicationsService.applyForAdoption(petId, message);
            setUserApplications(prev => [...prev, application]);
            return { success: true, data: application };
        } catch (err) {
            const errorMsg = err.message;
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
            const updatedApp = await applicationsService.approveApplication(appId, notes);
            setAllApplications(prev => prev.map(app => 
                app._id === appId ? updatedApp : app
            ));
            return { success: true, data: updatedApp };
        } catch (err) {
            const errorMsg = err.message;
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
            const updatedApp = await applicationsService.rejectApplication(appId, notes);
            setAllApplications(prev => prev.map(app => 
                app._id === appId ? updatedApp : app
            ));
            return { success: true, data: updatedApp };
        } catch (err) {
            const errorMsg = err.message;
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
            await applicationsService.withdrawApplication(appId);
            setUserApplications(prev => prev.filter(app => app._id !== appId));
            return { success: true };
        } catch (err) {
            const errorMsg = err.message;
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
                clearError,
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