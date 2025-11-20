
import React, { useContext, useEffect, useState } from 'react';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { PetsContext } from '../context/PetsContext';
import { UIContext } from '../context/UIContext';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [editingPet, setEditingPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    photoUrl: '',
    description: '',
  });

  const { allApplications, getAllApplications, approveApplication, rejectApplication, isLoading: appLoading } = useContext(ApplicationsContext);
  const { allPets, addPet, updatePet, deletePet, fetchPets, isLoading: petLoading } = useContext(PetsContext);
  const { showToast } = useContext(UIContext);

  useEffect(() => {
    getAllApplications();
    fetchPets(1);
  }, []);

  const handleAddPet = async (e) => {
    e.preventDefault();
    const result = await addPet(petForm);
    if (result.success) {
      showToast('Pet added successfully!', 'success');
      setPetForm({ name: '', species: '', breed: '', age: '', photoUrl: '', description: '' });
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure?')) {
      const result = await deletePet(id);
      if (result.success) {
        showToast('Pet deleted successfully!', 'success');
      }
    }
  };

  const handleApproveApp = async (appId) => {
    const result = await approveApplication(appId, 'Application approved by admin');
    if (result.success) {
      showToast('Application approved!', 'success');
    }
  };

  const handleRejectApp = async (appId) => {
    const result = await rejectApplication(appId, 'Application rejected by admin');
    if (result.success) {
      showToast('Application rejected!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'applications'
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'pets'
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Manage Pets
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {appLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="spinner w-12 h-12"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Pet</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{app.userName}</td>
                      <td className="px-6 py-4">{app.petName}</td>
                      <td className="px-6 py-4">
                        <span className={`badge badge-${app.status === 'Pending' ? 'warning' : app.status === 'Approved' ? 'success' : 'error'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        {app.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApproveApp(app._id)}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            >
                              <Check size={18} /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectApp(app._id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <X size={18} /> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pets Tab */}
        {activeTab === 'pets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Pet Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus size={28} /> Add New Pet
              </h2>

              <form onSubmit={handleAddPet} className="space-y-4">
                {Object.keys(petForm).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    {key === 'description' ? (
                      <textarea
                        value={petForm[key]}
                        onChange={(e) => setPetForm({ ...petForm, [key]: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={key === 'age' ? 'number' : 'text'}
                        value={petForm[key]}
                        onChange={(e) => setPetForm({ ...petForm, [key]: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className="w-full btn btn-primary py-3 font-semibold">
                  Add Pet
                </button>
              </form>
            </div>

            {/* Pets List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Manage Pets</h2>

              {petLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="spinner w-12 h-12"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allPets.slice(0, 10).map((pet) => (
                    <div key={pet._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-semibold">{pet.name}</h4>
                        <p className="text-sm text-gray-600">{pet.breed} • {pet.age} months</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
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