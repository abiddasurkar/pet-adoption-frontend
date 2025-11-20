// src/components/PetCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

export default function PetCard({ pet }) {
  return (
    <Link to={`/pet/${pet._id}`}>
      <div className="card bg-white overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={pet.photoUrl || 'https://via.placeholder.com/300x200'}
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
              <span>Age: {pet.age} months</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`badge ${pet.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
              {pet.status}
            </span>
          </div>

          <p className="text-gray-700 text-sm mt-3 line-clamp-2">{pet.description}</p>

          <button className="w-full btn btn-primary mt-4">View Details</button>
        </div>
      </div>
    </Link>
  );
}