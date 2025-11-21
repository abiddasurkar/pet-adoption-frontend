import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { UserPlus, User, Mail, Lock, Phone, MapPin, X, LogIn, AlertCircle } from 'lucide-react';

export default function AuthModal() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    });

    const { login, signup, isLoading, error, clearError, isLoggedIn, logout } = useContext(AuthContext);
    const { showToast, authModalOpen, closeAuthModal, openAuthModal, signupModalOpen, closeSignupModal } = useContext(UIContext);

    // Determine if modal should be open and what mode
    const isModalOpen = authModalOpen || signupModalOpen;
    const shouldBeSignupMode = signupModalOpen;

    // Check mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Set mode based on which modal opened
    useEffect(() => {
        if (signupModalOpen) {
            setIsLoginMode(false);
        } else if (authModalOpen) {
            setIsLoginMode(true);
        }
    }, [signupModalOpen, authModalOpen]);

    // Auto-close modal if user is logged in
    useEffect(() => {
        if (isLoggedIn && isModalOpen) {
            closeAuthModal();
            closeSignupModal();
        }
    }, [isLoggedIn, isModalOpen, closeAuthModal, closeSignupModal]);

    // Clear form when modal is opened (after sign out)
    useEffect(() => {
        if (isModalOpen && !isLoggedIn) {
            resetForm();
        }
    }, [isModalOpen, isLoggedIn]);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    // Validation functions
    const validateField = (name, value) => {
        const errors = {};
        
        if (name === 'email') {
            if (!value) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                errors.email = 'Email is invalid';
            }
        }

        if (name === 'password') {
            if (!value) {
                errors.password = 'Password is required';
            } else if (value.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
        }

        if (name === 'name' && !isLoginMode) {
            if (!value) {
                errors.name = 'Full name is required';
            } else if (value.length < 2) {
                errors.name = 'Name must be at least 2 characters';
            }
        }

        if (name === 'phone' && !isLoginMode && value) {
            if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
                errors.phone = 'Phone number must be 10 digits';
            }
        }

        return errors;
    };

    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        // Name validation for signup
        if (!isLoginMode) {
            if (!formData.name) {
                errors.name = 'Full name is required';
            } else if (formData.name.length < 2) {
                errors.name = 'Name must be at least 2 characters';
            }
        }

        // Phone validation for signup (optional but validate if provided)
        if (!isLoginMode && formData.phone) {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                errors.phone = 'Phone number must be 10 digits';
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Mark field as touched
        setTouchedFields((prev) => ({ ...prev, [name]: true }));
        
        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errors = validateField(name, value);
        setFormErrors((prev) => ({ ...prev, ...errors }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        
        // Mark all fields as touched to show all errors
        const allFields = isLoginMode 
            ? ['email', 'password']
            : ['name', 'email', 'password', 'phone', 'address'];
        
        const touchedAll = {};
        allFields.forEach(field => {
            touchedAll[field] = true;
        });
        setTouchedFields(touchedAll);

        // Validate entire form
        const errors = validateForm();
        setFormErrors(errors);

        // If there are errors, don't submit
        if (Object.keys(errors).length > 0) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        let result;
        if (isLoginMode) {
            result = await login(formData.email, formData.password);
        } else {
            result = await signup(
                formData.email,
                formData.password,
                formData.name,
                formData.phone,
                formData.address
            );
        }

        if (result.success) {
            showToast(isLoginMode ? 'Login successful!' : 'Signup successful! Welcome!', 'success');
            // Modal will auto-close via useEffect when isLoggedIn changes
            resetForm();
        } else {
            showToast(result.error, 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
        });
        setFormErrors({});
        setTouchedFields({});
        clearError();
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        resetForm();
    };

    const handleClose = () => {
        closeAuthModal();
        closeSignupModal();
        resetForm();
    };

    const getInputClassName = (fieldName) => {
        const hasError = formErrors[fieldName] && touchedFields[fieldName];
        return `w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
            hasError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-purple-600 focus:border-transparent'
        }`;
    };

    // Don't render if user is already logged in or modal is not open
    if (!isModalOpen || isLoggedIn) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div 
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 sm:p-2 z-10 bg-white rounded-full shadow-sm"
                    aria-label="Close modal"
                >
                    <X size={isMobile ? 20 : 24} />
                </button>

                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 text-center pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-8 border-b border-gray-100">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                            {isLoginMode ? (
                                <LogIn size={isMobile ? 24 : 32} className="text-white" />
                            ) : (
                                <UserPlus size={isMobile ? 24 : 32} className="text-white" />
                            )}
                        </div>
                    </div>
                    <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2`}>
                        {isLoginMode ? 'Welcome Back' : 'Join Our Community'}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {isLoginMode ? 'Sign in to your account to continue' : 'Create your account to start your adoption journey'}
                    </p>
                </div>

                {/* Error Message - Fixed below header */}
                {error && (
                    <div className="flex-shrink-0 mx-4 sm:mx-8 mt-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={isMobile ? 12 : 14} className="text-red-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium break-words flex-1">{error}</span>
                    </div>
                )}

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        {/* Name - Only for Signup */}
                        {!isLoginMode && (
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={isMobile ? 16 : 20} className={formErrors.name && touchedFields.name ? 'text-red-400' : 'text-gray-400'} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required={!isLoginMode}
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputClassName('name')}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {formErrors.name && touchedFields.name && (
                                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {formErrors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={isMobile ? 16 : 20} className={formErrors.email && touchedFields.email ? 'text-red-400' : 'text-gray-400'} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClassName('email')}
                                    placeholder="your@email.com"
                                />
                            </div>
                            {formErrors.email && touchedFields.email && (
                                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={isMobile ? 16 : 20} className={formErrors.password && touchedFields.password ? 'text-red-400' : 'text-gray-400'} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClassName('password')}
                                    placeholder="••••••••"
                                />
                            </div>
                            {formErrors.password && touchedFields.password && (
                                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Phone - Only for Signup */}
                        {!isLoginMode && (
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={isMobile ? 16 : 20} className={formErrors.phone && touchedFields.phone ? 'text-red-400' : 'text-gray-400'} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={getInputClassName('phone')}
                                        placeholder="123-456-7890"
                                    />
                                </div>
                                {formErrors.phone && touchedFields.phone && (
                                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {formErrors.phone}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Address - Only for Signup */}
                        {!isLoginMode && (
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin size={isMobile ? 16 : 20} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={getInputClassName('address')}
                                        placeholder="123 Main St, City, State"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-100">
                    {/* Submit Button */}
                    <div className="px-4 sm:px-8 py-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                                {isLoading ? (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    isLoginMode ? (
                                        <LogIn size={isMobile ? 16 : 20} className="group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <UserPlus size={isMobile ? 16 : 20} className="group-hover:scale-110 transition-transform" />
                                    )
                                )}
                                {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </div>

                    {/* Switch Mode */}
                    <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-xs sm:text-sm">
                            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={switchMode}
                                className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-xs sm:text-sm"
                            >
                                {isLoginMode ? 'Create one now' : 'Sign in here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}