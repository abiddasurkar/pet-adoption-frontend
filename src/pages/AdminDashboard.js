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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [editingPet, setEditingPet] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    size: '',
    gender: '',
    status: PET_STATUS.AVAILABLE,
    healthStatus: PET_HEALTH_STATUS.GOOD,
    temperament: [],
    photoBase64: null,
    description: '',
    isFeatured: false,
  });

  const {
    allApplications,
    getAllApplications,
    approveApplication,
    rejectApplication,
    isLoading: appLoading
  } = useContext(ApplicationsContext);

  const {
    allPets,
    addPet,
    updatePet,
    deletePet,
    fetchPets,
    isLoading: petLoading
  } = useContext(PetsContext);

  const { showToast } = useContext(UIContext);

  const fileInputRef = React.useRef(null);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([getAllApplications(), fetchPets(1)]);
    } catch (error) {
      showToast('Error loading data', 'error');
    }
  }, [getAllApplications, fetchPets, showToast]);

  // Reset form
  const resetForm = () => {
    setPetForm({
      name: '',
      species: '',
      breed: '',
      age: '',
      size: '',
      gender: '',
      status: PET_STATUS.AVAILABLE,
      healthStatus: PET_HEALTH_STATUS.GOOD,
      temperament: [],
      photoBase64: null,
      description: '',
      isFeatured: false,
    });
    setEditingPet(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle pet form changes
  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'temperament') {
      setPetForm(prev => ({
        ...prev,
        temperament: checked
          ? [...prev.temperament, value]
          : prev.temperament.filter(t => t !== value)
      }));
    } else if (name === 'isFeatured') {
      setPetForm(prev => ({
        ...prev,
        isFeatured: checked
      }));
    } else {
      setPetForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle photo change - simplified without cropping
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPetForm(prev => ({
        ...prev,
        photoBase64: reader.result
      }));
      showToast('Photo uploaded successfully', 'success');
    };
    reader.onerror = () => {
      showToast('Error uploading photo', 'error');
    };
  };

  const handleAddOrUpdatePet = async (e) => {
    e.preventDefault();

    if (!petForm.name || !petForm.species || !petForm.breed || !petForm.age) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (!petForm.photoBase64) {
      showToast('Please upload a photo', 'error');
      return;
    }

    try {
      let result;
      if (editingPet) {
        result = await updatePet(editingPet._id, petForm);
        if (result.success) {
          showToast('Pet updated successfully!', 'success');
          // CRITICAL: Refetch pets after update to ensure UI reflects changes
          await fetchPets(1);
        }
      } else {
        result = await addPet(petForm);
        if (result.success) {
          showToast('Pet added successfully!', 'success');
          // Refetch to update list
          await fetchPets(1);
        }
      }

      if (!result.success) {
        showToast(result.error, 'error');
      } else {
        resetForm();
      }
    } catch (error) {
      showToast(error.message || 'Error saving pet', 'error');
    }
  };

  // Also update the handleDeletePet function:
  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const result = await deletePet(id);
        if (result.success) {
          showToast('Pet deleted successfully!', 'success');
          // Refetch to update list
          await fetchPets(1);
        } else {
          showToast(result.error, 'error');
        }
      } catch (error) {
        showToast(error.message || 'Error deleting pet', 'error');
      }
    }
  };

  // Handle edit pet
  const handleEditPet = (pet) => {
    setPetForm(pet);
    setEditingPet(pet);
    setActiveTab('pets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle approve application
  const handleApproveApp = async (appId) => {
    try {
      const result = await approveApplication(appId, 'Application approved by admin');
      if (result.success) {
        showToast('Application approved!', 'success');
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast(error.message || 'Error approving application', 'error');
    }
  };

  // Handle reject application
  const handleRejectApp = async (appId) => {
    try {
      const result = await rejectApplication(appId, 'Application rejected by admin');
      if (result.success) {
        showToast('Application rejected!', 'success');
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast(error.message || 'Error rejecting application', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage pet adoptions and listings</p>
        </div>

        {/* Tabs - Responsive */}
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

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {appLoading ? (
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
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          {app.status === 'Pending' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleApproveApp(app._id)}
                                className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                              >
                                <Check size={14} />
                                <span className="hidden xs:inline">Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectApp(app._id)}
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
        )}

        {/* Pets Tab */}
        {activeTab === 'pets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add/Edit Pet Form */}
            <div className={`lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 ${!isMobile ? 'sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto' : ''
              }`}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                  <Plus size={20} className="text-white" />
                </div>
                {editingPet ? 'Edit Pet' : 'Add New Pet'}
              </h2>

              <form onSubmit={handleAddOrUpdatePet} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={petForm.name}
                    onChange={handlePetFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter pet name"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo *
                  </label>
                  {petForm.photoBase64 ? (
                    <div className="relative group">
                      <img
                        src={petForm.photoBase64}
                        alt="Pet preview"
                        className="w-full h-32 sm:h-40 object-cover rounded-xl border-2 border-purple-300 shadow-sm group-hover:shadow-md transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setPetForm(prev => ({ ...prev, photoBase64: null }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <Plus size={24} className="text-gray-400 mb-2 mx-auto group-hover:text-purple-600 transition-colors" />
                        <span className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                          Click to upload photo
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </button>
                  )}
                </div>

                {/* Species */}
                {/* In the Species dropdown */}
                <select
                  name="species"
                  value={petForm.species}
                  onChange={handlePetFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">Select species</option>
                  {PET_SPECIES && Object.values(PET_SPECIES).filter(species => species && typeof species === 'string').map(species => (
                    <option key={species} value={species}>
                      {species.charAt(0).toUpperCase() + species.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed *
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={petForm.breed}
                    onChange={handlePetFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter breed"
                  />
                </div>

                {/* In the Age dropdown */}
                <select
                  name="age"
                  value={petForm.age}
                  onChange={handlePetFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">Select age</option>
                  {PET_AGES && Object.values(PET_AGES).filter(age => age && typeof age === 'string').map(age => (
                    <option key={age} value={age}>
                      {age.charAt(0).toUpperCase() + age.slice(1)}
                    </option>
                  ))}
                </select>

                {/* In the Size dropdown */}
                <select
                  name="size"
                  value={petForm.size}
                  onChange={handlePetFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">Select size</option>
                  {PET_SIZES && Object.values(PET_SIZES).filter(size => size && typeof size === 'string').map(size => (
                    <option key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>

                {/* In the Gender dropdown */}
                <select
                  name="gender"
                  value={petForm.gender}
                  onChange={handlePetFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="">Select gender</option>
                  {PET_GENDERS && Object.values(PET_GENDERS).filter(gender => gender && typeof gender === 'string').map(gender => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
                {/* Health Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Status
                  </label>
                  <select
                    name="healthStatus"
                    value={petForm.healthStatus}
                    onChange={handlePetFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    {Object.values(PET_HEALTH_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Temperament */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperament
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
                    {Object.values(PET_TEMPERAMENT).map(temp => (
                      <label key={temp} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="temperament"
                          value={temp}
                          checked={petForm.temperament.includes(temp)}
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

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={petForm.status}
                    onChange={handlePetFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    {Object.values(PET_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-purple-50 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={petForm.isFeatured}
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={petForm.description}
                    onChange={handlePetFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 resize-none"
                    rows="3"
                    placeholder="Enter pet description"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={petLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save size={18} />
                    {editingPet ? 'Update Pet' : 'Add Pet'}
                  </button>
                  {editingPet && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <XCircle size={18} /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Pets List */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Pets ({allPets.length})</h2>

              {petLoading ? (
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

                          {/* Safe species and breed display */}
                          <p className="text-sm text-gray-600 mb-3">
                            {pet.species ? `${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}` : 'Unknown Species'}
                            {pet.breed ? ` • ${pet.breed}` : ''}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {/* Safe age display */}
                            <span className="inline-block px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                              {pet.age || 'Unknown Age'}
                            </span>

                            {/* Safe status display */}
                            <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${pet.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : pet.status === 'adopted'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-yellow-100 text-yellow-700'
                              }`}>
                              {pet.status ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1) : 'Unknown Status'}
                            </span>

                            {/* Safe gender display */}
                            {pet.gender && (
                              <span className="inline-block px-2.5 py-1 text-xs bg-pink-100 text-pink-700 rounded-full font-medium">
                                {pet.gender}
                              </span>
                            )}
                          </div>

                          {/* Safe temperament display */}
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

                          {/* Safe description display */}
                          {pet.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                              {pet.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                          <button
                            onClick={() => handleEditPet(pet)}
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
          </div>
        )}
      </div>
    </div>
  );
}