import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { PetsContext } from '../context/PetsContext';
import { UIContext } from '../context/UIContext';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  PET_SPECIES,
  PET_AGES,
  PET_SIZES,
  PET_GENDERS,
  PET_STATUS,
  PET_HEALTH_STATUS,
  PET_TEMPERAMENT
} from '../services/api/constants';

const INITIAL_PET_FORM = {
  name: '',
  species: '',
  breed: '',
  age: '',
  size: '',
  gender: '',
  status: PET_STATUS.AVAILABLE,
  healthStatus: PET_HEALTH_STATUS.GOOD,
  temperament: [],
  photoFile: null,
  description: '',
  isFeatured: false,
};

export default function AdminDashboard() {
  // ===== STATE MANAGEMENT =====
  const [activeTab, setActiveTab] = useState('applications');
  const [editingPet, setEditingPet] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petFormData, setPetFormData] = useState(INITIAL_PET_FORM);
  const [photoPreview, setPhotoPreview] = useState(null);

  // ===== CONTEXT HOOKS =====
  const {
    allApplications,
    getAllApplications,
    approveApplication,
    rejectApplication,
    isLoading: isLoadingApplications,
    error: applicationsError,
    clearError: clearApplicationsError,
  } = useContext(ApplicationsContext);

  const {
    allPets,
    addPet,
    updatePet,
    deletePet,
    fetchPets,
    isLoading: isLoadingPets,
    error: petsError,
    clearError: clearPetsError,
  } = useContext(PetsContext);

  const { showToast } = useContext(UIContext);

  const fileInputRef = React.useRef(null);

  // ===== EFFECTS =====
  useEffect(() => {
    handleCheckMobileViewport();
    window.addEventListener('resize', handleCheckMobileViewport);
    return () => window.removeEventListener('resize', handleCheckMobileViewport);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle errors from context
  useEffect(() => {
    if (applicationsError) {
      showToast(applicationsError, 'error');
      clearApplicationsError();
    }
  }, [applicationsError, showToast, clearApplicationsError]);

  useEffect(() => {
    if (petsError) {
      showToast(petsError, 'error');
      clearPetsError();
    }
  }, [petsError, showToast, clearPetsError]);

  // ===== EVENT HANDLERS =====
  const handleCheckMobileViewport = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const loadInitialData = useCallback(async () => {
    try {
      await Promise.all([getAllApplications(), fetchPets(1)]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      showToast('Error loading data', 'error');
    }
  }, [getAllApplications, fetchPets, showToast]);

  const handleResetForm = () => {
    setPetFormData(INITIAL_PET_FORM);
    setPhotoPreview(null);
    setEditingPet(null);
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validatePetForm = () => {
    const newErrors = {};

    // Name validation
    if (!petFormData.name || petFormData.name.trim() === '') {
      newErrors.name = 'Pet name is required';
    } else if (petFormData.name.length > 50) {
      newErrors.name = 'Pet name cannot exceed 50 characters';
    }

    // Species validation
    if (!petFormData.species || petFormData.species.trim() === '') {
      newErrors.species = 'Species is required';
    }

    // Breed validation
    if (!petFormData.breed || petFormData.breed.trim() === '') {
      newErrors.breed = 'Breed is required';
    } else if (petFormData.breed.length > 50) {
      newErrors.breed = 'Breed cannot exceed 50 characters';
    }

    // Age validation
    if (!petFormData.age || petFormData.age.trim() === '') {
      newErrors.age = 'Age is required';
    }

    // Photo validation - only required when adding new pet
    if (!editingPet && !petFormData.photoFile) {
      newErrors.photoFile = 'Photo is required';
    }

    // Description validation
    if (!petFormData.description || petFormData.description.trim() === '') {
      newErrors.description = 'Description is required';
    } else if (petFormData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    } else if (petFormData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'temperament') {
      setPetFormData(prev => ({
        ...prev,
        temperament: checked
          ? [...prev.temperament, value]
          : prev.temperament.filter(t => t !== value)
      }));
    } else if (name === 'isFeatured') {
      setPetFormData(prev => ({
        ...prev,
        isFeatured: checked
      }));
    } else {
      setPetFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    // Store the file object directly
    setPetFormData(prev => ({
      ...prev,
      photoFile: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setFormErrors(prev => ({
        ...prev,
        photoFile: ''
      }));
      showToast('Photo uploaded successfully', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading photo', 'error');
    };
  };

  const handleRemovePhoto = () => {
    setPetFormData(prev => ({ ...prev, photoFile: null }));
    setPhotoPreview(null);
    setFormErrors(prev => ({ ...prev, photoFile: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitPetForm = async (e) => {
    e.preventDefault();

    if (!validatePetForm()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const isEditing = Boolean(editingPet && editingPet._id);

    try {
      // Prepare pet data for API
      const petDataToSend = {
        name: petFormData.name.trim(),
        species: petFormData.species.trim(),
        breed: petFormData.breed.trim(),
        age: petFormData.age.trim(),
        size: petFormData.size || 'medium',
        gender: petFormData.gender || 'unknown',
        healthStatus: petFormData.healthStatus || PET_HEALTH_STATUS.GOOD,
        temperament: petFormData.temperament || [],
        description: petFormData.description.trim(),
        isFeatured: Boolean(petFormData.isFeatured),
        status: petFormData.status || PET_STATUS.AVAILABLE,
      };

      // Only add photoFile if it's a File object (new upload)
      if (petFormData.photoFile instanceof File) {
        petDataToSend.photoFile = petFormData.photoFile;
      }

      console.log('Submitting pet:', {
        isEditing,
        petId: editingPet?._id,
        hasPhoto: !!petDataToSend.photoFile
      });

      let result;
      if (isEditing) {
        result = await updatePet(editingPet._id, petDataToSend);
        if (result.success) {
          showToast('Pet updated successfully!', 'success');
        } else {
          showToast(result.error || 'Failed to update pet', 'error');
          return;
        }
      } else {
        result = await addPet(petDataToSend);
        if (result.success) {
          showToast('Pet added successfully!', 'success');
        } else {
          showToast(result.error || 'Failed to add pet', 'error');
          return;
        }
      }

      await fetchPets(1);
      handleResetForm();

    } catch (error) {
      console.error('Form submission error:', error);
      showToast(error.message || 'Error saving pet', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const result = await deletePet(petId);
        if (result.success) {
          showToast('Pet deleted successfully!', 'success');
          await fetchPets(1);
        } else {
          showToast(result.error || 'Failed to delete pet', 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast(error.message || 'Error deleting pet', 'error');
      }
    }
  };

  const handleEditPetClick = (pet) => {
    if (!pet || !pet._id) {
      console.error('Invalid pet object:', pet);
      showToast('Error: Pet data missing', 'error');
      return;
    }

    console.log('Editing pet:', pet._id);

    // Store ID
    setEditingPet({ _id: pet._id });

    // Fill form with existing data
    setPetFormData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      size: pet.size || '',
      gender: pet.gender || '',
      status: pet.status || PET_STATUS.AVAILABLE,
      healthStatus: pet.healthStatus || PET_HEALTH_STATUS.GOOD,
      temperament: Array.isArray(pet.temperament) ? pet.temperament : [],
      photoFile: null,
      description: pet.description || '',
      isFeatured: !!pet.isFeatured,
    });

    // Set photo preview from base64
    if (pet.photoBase64) {
      setPhotoPreview(pet.photoBase64);
    } else {
      setPhotoPreview(null);
    }

    setFormErrors({});
    setActiveTab('pets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveApplication = async (appId) => {
    try {
      const result = await approveApplication(appId, 'Application approved by admin');
      if (result.success) {
        showToast('Application approved!', 'success');
        await getAllApplications();
      } else {
        showToast(result.error || 'Failed to approve application', 'error');
      }
    } catch (error) {
      console.error('Approve error:', error);
      showToast(error.message || 'Error approving application', 'error');
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      const result = await rejectApplication(appId, 'Application rejected by admin');
      if (result.success) {
        showToast('Application rejected!', 'success');
        await getAllApplications();
      } else {
        showToast(result.error || 'Failed to reject application', 'error');
      }
    } catch (error) {
      console.error('Reject error:', error);
      showToast(error.message || 'Error rejecting application', 'error');
    }
  };

  // ===== UTILITY FUNCTIONS =====
  const getApplicationStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getPetStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'adopted':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'fostered':
        return 'bg-blue-100 text-blue-700';
      case 'not_available':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ===== RENDER COMPONENTS =====
  const renderApplicationsTab = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {isLoadingApplications ? (
        <div className="flex justify-center items-center h-64 sm:h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : allApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 sm:h-96 p-8">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium text-center">No applications found</p>
          <p className="text-gray-400 text-sm text-center mt-2">New adoption applications will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider hidden sm:table-cell">
                  Pet
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-all duration-200 group">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {app.userName}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">{app.petName}</div>
                      <div className="text-xs text-gray-500 md:hidden">{app.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">
                    {app.petName}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {app.userEmail}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${getApplicationStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {app.status === 'Pending' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleApproveApplication(app._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <Check size={14} />
                          <span className="hidden xs:inline">Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <X size={14} />
                          <span className="hidden xs:inline">Reject</span>
                        </button>
                      </div>
                    )}
                    {app.status !== 'Pending' && (
                      <span className="text-gray-500 text-sm font-medium">{app.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPetForm = () => (
    <div className={`lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 ${!isMobile ? 'sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto' : ''}`}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
          <Plus size={20} className="text-white" />
        </div>
        {editingPet ? 'Edit Pet' : 'Add New Pet'}
      </h2>

      <form onSubmit={handleSubmitPetForm} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pet Name * <span className="text-gray-500 text-xs">({petFormData.name.length}/50)</span>
          </label>
          <input
            type="text"
            name="name"
            value={petFormData.name}
            onChange={handlePetFormChange}
            maxLength="50"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${formErrors.name ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-purple-600'}`}
            placeholder="Enter pet name"
          />
          {formErrors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.name}
            </p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo {!editingPet && '*'}
            {editingPet && <span className="text-gray-500 text-xs ml-1">(Optional)</span>}
          </label>
          {photoPreview ? (
            <div className="relative group">
              <img
                src={photoPreview}
                alt="Pet preview"
                className="w-full h-32 sm:h-40 object-cover rounded-xl border-2 border-purple-300 shadow-sm group-hover:shadow-md transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-110"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group ${formErrors.photoFile ? 'border-red-400 bg-red-50 hover:border-red-600' : 'border-gray-300 hover:border-purple-600 hover:bg-purple-50'}`}
            >
              <div className="text-center">
                <Plus size={24} className={`mb-2 mx-auto transition-colors ${formErrors.photoFile ? 'text-red-500' : 'text-gray-400 group-hover:text-purple-600'}`} />
                <span className={`text-sm transition-colors ${formErrors.photoFile ? 'text-red-600' : 'text-gray-600 group-hover:text-purple-600'}`}>
                  {editingPet ? 'Change photo' : 'Upload photo'}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </button>
          )}
          {formErrors.photoFile && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.photoFile}
            </p>
          )}
        </div>

        {/* Species Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
          <select
            name="species"
            value={petFormData.species}
            onChange={handlePetFormChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white ${formErrors.species ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-purple-600'}`}
          >
            <option value="">Select species</option>
            {PET_SPECIES && Object.values(PET_SPECIES).filter(s => s && typeof s === 'string').map(species => (
              <option key={species} value={species}>
                {species.charAt(0).toUpperCase() + species.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          {formErrors.species && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.species}
            </p>
          )}
        </div>

        {/* Breed Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Breed * <span className="text-gray-500 text-xs">({petFormData.breed.length}/50)</span>
          </label>
          <input
            type="text"
            name="breed"
            value={petFormData.breed}
            onChange={handlePetFormChange}
            maxLength="50"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${formErrors.breed ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-purple-600'}`}
            placeholder="Enter breed"
          />
          {formErrors.breed && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.breed}
            </p>
          )}
        </div>

        {/* Age Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
          <select
            name="age"
            value={petFormData.age}
            onChange={handlePetFormChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 appearance-none bg-white ${formErrors.age ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-purple-600'}`}
          >
            <option value="">Select age</option>
            {PET_AGES && Object.values(PET_AGES).filter(a => a && typeof a === 'string').map(age => (
              <option key={age} value={age}>
                {age.charAt(0).toUpperCase() + age.slice(1)}
              </option>
            ))}
          </select>
          {formErrors.age && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.age}
            </p>
          )}
        </div>

        {/* Size Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            name="size"
            value={petFormData.size}
            onChange={handlePetFormChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
          >
            <option value="">Select size</option>
            {PET_SIZES && Object.values(PET_SIZES).filter(s => s && typeof s === 'string').map(size => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={petFormData.gender}
            onChange={handlePetFormChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
          >
            <option value="">Select gender</option>
            {PET_GENDERS && Object.values(PET_GENDERS).filter(g => g && typeof g === 'string').map(gender => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Health Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
          <select
            name="healthStatus"
            value={petFormData.healthStatus}
            onChange={handlePetFormChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
          >
            {Object.values(PET_HEALTH_STATUS).filter(s => s && typeof s === 'string').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Temperament Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperament</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
            {Object.values(PET_TEMPERAMENT).filter(t => t && typeof t === 'string').map(temp => (
              <label key={temp} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="temperament"
                  value={temp}
                  checked={petFormData.temperament.includes(temp)}
                  onChange={handlePetFormChange}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 transition"
                />
                <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                  {temp.charAt(0).toUpperCase() + temp.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={petFormData.status}
            onChange={handlePetFormChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
          >
            {Object.values(PET_STATUS).filter(s => s && typeof s === 'string').map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-purple-50 transition-all duration-200">
          <input
            type="checkbox"
            name="isFeatured"
            checked={petFormData.isFeatured}
            onChange={handlePetFormChange}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-600 transition"
          />
          <div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
              Featured on homepage
            </span>
            <p className="text-xs text-gray-500">Show this pet prominently on the homepage</p>
          </div>
        </label>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description * <span className="text-gray-500 text-xs">({petFormData.description.length}/1000)</span>
          </label>
          <textarea
            name="description"
            value={petFormData.description}
            onChange={handlePetFormChange}
            maxLength="1000"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${formErrors.description ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-purple-600'}`}
            rows="3"
            placeholder="Enter pet description (minimum 10 characters)"
          />
          {formErrors.description && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {formErrors.description}
            </p>
          )}
        </div>

        {/* Form Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoadingPets}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{editingPet ? 'Update Pet' : 'Add Pet'}</span>
              </>
            )}
          </button>
          {editingPet && (
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <XCircle size={18} /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderPetsList = () => (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Pets ({allPets.length})</h2>

      {isLoadingPets ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : allPets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium text-center">No pets found</p>
          <p className="text-gray-400 text-sm text-center mt-2">Add your first pet to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-screen overflow-y-auto pr-2">
          {allPets.map((pet) => (
            <div
              key={pet._id}
              className="flex flex-col border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-purple-200 bg-white transform hover:-translate-y-1"
            >
              {/* Pet Image */}
              {pet.photoBase64 && (
                <div className="relative overflow-hidden">
                  <img
                    src={pet.photoBase64}
                    alt={pet.name || 'Pet image'}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {pet.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                      {pet.name || 'Unnamed Pet'}
                    </h4>
                    {pet.isFeatured && (
                      <span className="hidden group-hover:inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        ⭐
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {pet.species ? `${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}` : 'Unknown Species'}
                    {pet.breed ? ` • ${pet.breed}` : ''}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                      {pet.age || 'Unknown Age'}
                    </span>

                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${getPetStatusBadgeClass(pet.status)}`}>
                      {pet.status ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1).replace('_', ' ') : 'Unknown Status'}
                    </span>

                    {pet.gender && (
                      <span className="inline-block px-2.5 py-1 text-xs bg-pink-100 text-pink-700 rounded-full font-medium">
                        {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                      </span>
                    )}
                  </div>

                  {pet.temperament && pet.temperament.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {pet.temperament.slice(0, 3).map(temp => (
                        <span key={temp} className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium">
                          {temp ? temp.charAt(0).toUpperCase() + temp.slice(1) : ''}
                        </span>
                      ))}
                      {pet.temperament.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                          +{pet.temperament.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {pet.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                      {pet.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                  <button
                    onClick={() => handleEditPetClick(pet)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm font-medium group/btn"
                  >
                    <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-medium group/btn"
                  >
                    <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPetsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {renderPetForm()}
      {renderPetsList()}
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-white pt-24 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage pet adoptions and listings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide mb-6 sm:mb-8 pb-2">
          <div className="flex gap-1 sm:gap-4 border-b border-gray-200 min-w-max">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === 'applications'
                ? 'text-purple-600 border-purple-600 bg-purple-50 rounded-t-lg'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
                }`}
            >
              Applications ({allApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === 'pets'
                ? 'text-purple-600 border-purple-600 bg-purple-50 rounded-t-lg'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
                }`}
            >
              Manage Pets ({allPets.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' && renderApplicationsTab()}
        {activeTab === 'pets' && renderPetsTab()}
      </div>
    </div>
  );
}