// src/components/SearchBar.js
import React, { useState, useContext } from 'react';
import { Search } from 'lucide-react';
import { PetsContext } from '../context/PetsContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { applyFilters, filters } = useContext(PetsContext);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(query, filters.selectedSpecies, filters.selectedBreed, filters.selectedAge);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <button type="submit" className="btn btn-primary flex items-center gap-2">
        <Search size={20} /> Search
      </button>
    </form>
  );
}
