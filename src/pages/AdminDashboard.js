import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { PetsContext } from '../context/PetsContext';
import { UIContext } from '../context/UIContext';
import { Plus, Edit2, Trash2, Check, X, Save, XCircle, AlertCircle } from 'lucide-react';
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

  // Handle photo change
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

  // Handle add/update pet
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
        }
      } else {
        result = await addPet(petForm);
        if (result.success) {
          showToast('Pet added successfully!', 'success');
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

  // Handle edit pet
  const handleEditPet = (pet) => {
    setPetForm(pet);
    setEditingPet(pet);
    setActiveTab('pets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete pet
  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const result = await deletePet(id);
        if (result.success) {
          showToast('Pet deleted successfully!', 'success');
        } else {
          showToast(result.error, 'error');
        }
      } catch (error) {
        showToast(error.message || 'Error deleting pet', 'error');
      }
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage pet adoptions and listings</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === 'applications'
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Applications ({allApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === 'pets'
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            Manage Pets ({allPets.length})
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {appLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : allApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <AlertCircle size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-lg">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pet</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{app.petName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.userEmail}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveApp(app._id)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-medium"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectApp(app._id)}
                                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                              >
                                <X size={16} /> Reject
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Pet Form */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 sticky top-4 h-fit max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus size={28} className="text-purple-600" />
                {editingPet ? 'Edit Pet' : 'Add New Pet'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={petForm.name}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter pet name"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo *
                  </label>
                  {petForm.photoBase64 ? (
                    <div className="relative">
                      <img
                        src={petForm.photoBase64}
                        alt="Pet preview"
                        className="w-full h-40 object-cover rounded-lg border-2 border-purple-300"
                      />
                      <button
                        type="button"
                        onClick={() => setPetForm(prev => ({ ...prev, photoBase64: null }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-600 transition"
                    >
                      <div className="text-center">
                        <Plus size={24} className="text-gray-400 mb-2 mx-auto" />
                        <span className="text-sm text-gray-600">Click to upload photo</span>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species *
                  </label>
                  <select
                    name="species"
                    value={petForm.species}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select species</option>
                    {PET_SPECIES && Object.values(PET_SPECIES).filter(Boolean).map(species => (
                      <option key={species} value={species}>
                        {species?.charAt(0).toUpperCase() + species?.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Breed *
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={petForm.breed}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter breed"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Category *
                  </label>
                  <select
                    name="age"
                    value={petForm.age}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select age</option>
                    {PET_AGES && Object.values(PET_AGES).filter(Boolean).map(age => (
                      <option key={age} value={age}>
                        {age?.charAt(0).toUpperCase() + age?.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    name="size"
                    value={petForm.size}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select size</option>
                    {PET_SIZES && Object.values(PET_SIZES).filter(Boolean).map(size => (
                      <option key={size} value={size}>
                        {size?.charAt(0).toUpperCase() + size?.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={petForm.gender}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select gender</option>
                    {PET_GENDERS && Object.values(PET_GENDERS).filter(Boolean).map(gender => (
                      <option key={gender} value={gender}>
                        {gender?.charAt(0).toUpperCase() + gender?.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Health Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Status
                  </label>
                  <select
                    name="healthStatus"
                    value={petForm.healthStatus}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {Object.values(PET_TEMPERAMENT).map(temp => (
                      <label key={temp} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="temperament"
                          value={temp}
                          checked={petForm.temperament.includes(temp)}
                          onChange={handlePetFormChange}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          {temp.charAt(0).toUpperCase() + temp.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={petForm.status}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {Object.values(PET_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={petForm.isFeatured}
                    onChange={handlePetFormChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
                </label>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={petForm.description}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows="3"
                    placeholder="Enter pet description"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleAddOrUpdatePet}
                    disabled={petLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Save size={18} /> {editingPet ? 'Update' : 'Add Pet'}
                  </button>
                  {editingPet && (
                    <button
                      onClick={resetForm}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      <XCircle size={18} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pets List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">All Pets ({allPets.length})</h2>

              {petLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : allPets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <AlertCircle size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-lg">No pets found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen overflow-y-auto pr-2">
                  {allPets.map((pet) => (
                    <div
                      key={pet._id}
                      className="flex flex-col border rounded-lg hover:shadow-lg transition overflow-hidden"
                    >
                      {/* Pet Image */}
                      {pet.photoBase64 && (
                        <img
                          src={pet.photoBase64}
                          alt={pet.name}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{pet.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} • {pet.breed}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                              {pet.age}
                            </span>
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              pet.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : pet.status === 'adopted'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                            </span>
                            {pet.isFeatured && (
                              <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                                Featured ⭐
                              </span>
                            )}
                          </div>
                          {pet.temperament && pet.temperament.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {pet.temperament.map(temp => (
                                <span key={temp} className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                                  {temp.charAt(0).toUpperCase() + temp.slice(1)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-3 border-t">
                          <button
                            onClick={() => handleEditPet(pet)}
                            className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-50 rounded transition text-sm font-medium"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePet(pet._id)}
                            className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                          >
                            <Trash2 size={16} /> Delete
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