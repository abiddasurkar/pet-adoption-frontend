// src/components/PetCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

export default function PetCard({ pet }) {
  // Ensure pet exists
  if (!pet || !pet._id) {
    return null;
  }

  const getStatusClass = (status) => {
    if (!status) return 'badge-secondary';
    
    const normalizedStatus = status.toLowerCase().trim();
    switch (normalizedStatus) {
      case 'available':
        return 'badge-success';
      case 'adopted':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      case 'fostered':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  const formatAgeDisplay = (age) => {
    if (!age || age === '') return 'Unknown Age';
    // Handle different age formats (e.g., "baby", "young", "adult", "senior")
    const ageStr = String(age).trim();
    if (!ageStr) return 'Unknown Age';
    return ageStr.charAt(0).toUpperCase() + ageStr.slice(1).toLowerCase();
  };

  const formatSpecies = (species) => {
    if (!species || species === '') return 'Unknown Species';
    const speciesStr = String(species).trim();
    if (!speciesStr) return 'Unknown Species';
    return speciesStr.charAt(0).toUpperCase() + speciesStr.slice(1).toLowerCase();
  };

  const getBreedDisplay = () => {
    if (!pet.breed || pet.breed === '') return 'Mixed Breed';
    return String(pet.breed).trim();
  };

  const getTemperamentDisplay = () => {
    if (!pet.temperament || !Array.isArray(pet.temperament) || pet.temperament.length === 0) {
      return [];
    }
    return pet.temperament.filter(temp => temp && String(temp).trim() !== '');
  };

  const petTemperament = getTemperamentDisplay();

  return (
    <Link to={`/pet/${pet._id}`}>
      <div className="card bg-white overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={pet.photoBase64 || 'https://via.placeholder.com/300x200'}
            alt={pet.name || 'Pet image'}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = 'https://via.placeholder.com/300x200';
            }}
          />
          <div className="absolute top-3 right-3">
            <button 
              className="bg-white p-2 rounded-full hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart size={20} className="text-red-500" />
            </button>
          </div>

          {/* Featured Badge */}
          {pet.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">
            {pet.name || 'Unnamed Pet'}
          </h3>
          <p className="text-gray-600 text-sm">
            {formatSpecies(pet.species)} • {getBreedDisplay()}
          </p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>Age: {formatAgeDisplay(pet.age)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <span className={`badge ${getStatusClass(pet.status)}`}>
              {pet.status 
                ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1).toLowerCase()
                : 'Unknown Status'
              }
            </span>
          </div>

          {/* Temperament Tags */}
          {petTemperament.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {petTemperament.slice(0, 2).map((temp, idx) => (
                <span 
                  key={`${temp}-${idx}`} 
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                >
                  {String(temp).charAt(0).toUpperCase() + String(temp).slice(1).toLowerCase()}
                </span>
              ))}
              {petTemperament.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{petTemperament.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {pet.description && (
            <p className="text-gray-700 text-sm mt-3 line-clamp-2">
              {String(pet.description).trim()}
            </p>
          )}

          <button 
            className="w-full btn btn-primary mt-4"
            onClick={(e) => {
              e.preventDefault();
              // Navigation happens via Link
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}