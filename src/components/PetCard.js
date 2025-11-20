// src/components/PetCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

export default function PetCard({ pet }) {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
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
    if (!age) return 'Unknown';
    return age.charAt(0).toUpperCase() + age.slice(1);
  };

  return (
    <Link to={`/pet/${pet._id}`}>
      <div className="card bg-white overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={pet.photoBase64 || 'https://via.placeholder.com/300x200'}
            alt={pet.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <div className="absolute top-3 right-3">
            <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition">
              <Heart size={20} className="text-red-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
          <p className="text-gray-600 text-sm">{pet.breed}</p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>Age: {formatAgeDisplay(pet.age)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            <span className={`badge ${getStatusClass(pet.status)}`}>
              {pet.status ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1) : 'Unknown'}
            </span>
          </div>

          {/* Temperament Tags */}
          {pet.temperament && pet.temperament.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {pet.temperament.slice(0, 2).map(temp => (
                <span key={temp} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {temp.charAt(0).toUpperCase() + temp.slice(1)}
                </span>
              ))}
              {pet.temperament.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{pet.temperament.length - 2}
                </span>
              )}
            </div>
          )}

          <p className="text-gray-700 text-sm mt-3 line-clamp-2">{pet.description}</p>

          <button className="w-full btn btn-primary mt-4">View Details</button>
        </div>
      </div>
    </Link>
  );
}