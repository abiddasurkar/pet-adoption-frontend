import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetsContext } from '../context/PetsContext';
import { AuthContext } from '../context/AuthContext';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { UIContext } from '../context/UIContext';
import { Heart, MapPin, Calendar, User, ArrowLeft, PawPrint } from 'lucide-react';

export default function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPet, isLoading, fetchPetById } = useContext(PetsContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { applyForAdoption } = useContext(ApplicationsContext);
  const { showToast, openApplyModal, showApplyModal, closeApplyModal, selectedPetId,openAuthModal } = useContext(UIContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPetById(id);
  }, [id]);

const handleApplyClick = () => {
  if (!isLoggedIn) {
    showToast('Please login to apply for adoption', 'warning');
    openAuthModal(); // Open auth modal instead of navigating
    return;
  }
  openApplyModal(id);
};

  const handleSubmitApplication = async () => {
    const result = await applyForAdoption(id, message);
    if (result.success) {
      showToast('Application submitted successfully!', 'success');
      closeApplyModal();
      setMessage('');
    } else {
      showToast(result.error, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
          <p className="text-gray-600 mb-6">The pet you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-all duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to pets
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Image Section */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <img
                  src={selectedPet.photoUrl || 'https://via.placeholder.com/400x400'}
                  alt={selectedPet.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                />
                {selectedPet.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      {selectedPet.name}
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">{selectedPet.breed}</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110 p-2">
                    <Heart size={32} fill="currentColor" />
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Species</p>
                      <p className="font-semibold text-gray-900">{selectedPet.species}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-semibold text-gray-900">{selectedPet.age} months</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-semibold ${selectedPet.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedPet.status}
                      </p>
                    </div>
                  </div>

                  {selectedPet.gender && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <User size={20} className="text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-semibold text-gray-900">{selectedPet.gender}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">About {selectedPet.name}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedPet.description}</p>
                </div>

                {/* Temperament Tags */}
                {selectedPet.temperament && selectedPet.temperament.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Personality</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPet.temperament.map((temp, index) => (
                        <span
                          key={index}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium text-sm"
                        >
                          {temp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyClick}
                disabled={selectedPet.status !== 'Available'}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${selectedPet.status === 'Available'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {selectedPet.status === 'Available' ? 'Apply to Adopt' : 'Not Available for Adoption'}
              </button>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && selectedPetId === id && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Adopt {selectedPet.name}
              </h2>
              <p className="text-gray-600 mb-6">Tell us why you'd be a great fit for {selectedPet.name}</p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your story, experience with pets, and why you want to adopt..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 resize-none bg-gray-50"
                rows="5"
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={closeApplyModal}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}