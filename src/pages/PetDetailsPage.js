import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetsContext } from '../context/PetsContext';
import { AuthContext } from '../context/AuthContext';
import { ApplicationsContext } from '../context/ApplicationsContext';
import { UIContext } from '../context/UIContext';
import { Heart, MapPin, Calendar, User } from 'lucide-react';

export default function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPet, isLoading, fetchPetById } = useContext(PetsContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { applyForAdoption } = useContext(ApplicationsContext);
  const { showToast, openApplyModal, showApplyModal, closeApplyModal, selectedPetId } = useContext(UIContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPetById(id);
  }, [id]);

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      showToast('Please login to apply for adoption', 'warning');
      navigate('/login');
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
      <div className="flex justify-center items-center h-96">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="text-purple-600 hover:text-purple-800 mb-4"
        >
          ← Back to pets
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="flex items-center justify-center">
              <img
                src={selectedPet.photoUrl || 'https://via.placeholder.com/400x400'}
                alt={selectedPet.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{selectedPet.name}</h1>
                  <p className="text-gray-600 text-lg">{selectedPet.breed}</p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Heart size={32} fill="currentColor" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <User size={20} />
                  <span>Species: <strong>{selectedPet.species}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={20} />
                  <span>Age: <strong>{selectedPet.age} months</strong></span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={20} />
                  <span>Status: <strong className={`${selectedPet.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedPet.status}
                  </strong></span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPet.description}</p>
              </div>

              <button
                onClick={handleApplyClick}
                disabled={selectedPet.status !== 'Available'}
                className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50"
              >
                {selectedPet.status === 'Available' ? 'Apply to Adopt' : 'Not Available'}
              </button>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && selectedPetId === id && (
          <div className="modal-backdrop">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Apply to Adopt {selectedPet.name}</h2>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us why you'd like to adopt this pet..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
                rows="4"
              />

              <div className="flex gap-3">
                <button
                  onClick={closeApplyModal}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="flex-1 btn btn-primary"
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
