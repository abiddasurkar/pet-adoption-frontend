// src/components/FilterSidebar.js
import React, { useState, useContext } from 'react';
import { PetsContext } from '../context/PetsContext';

export default function FilterSidebar() {
  const { applyFilters, filters } = useContext(PetsContext);
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  const handleFilter = () => {
    applyFilters(filters.searchQuery, species, breed, age);
  };

  const handleReset = () => {
    setSpecies('');
    setBreed('');
    setAge('');
    applyFilters('', '', '', '');
  };

  return (
    <aside className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      {/* Species */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Species</label>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Bird">Bird</option>
        </select>
      </div>

      {/* Breed */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="Enter breed..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Age */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Age (months)</label>
        <select
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="">Any Age</option>
          <option value="0-6">0-6 months (Baby)</option>
          <option value="6-12">6-12 months (Young)</option>
          <option value="12-36">1-3 years (Adult)</option>
          <option value="36+">3+ years (Senior)</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={handleFilter} className="flex-1 btn btn-primary">
          Apply
        </button>
        <button onClick={handleReset} className="flex-1 btn btn-secondary">
          Reset
        </button>
      </div>
    </aside>
  );
}