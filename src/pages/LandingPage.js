import React, { useContext, useEffect } from 'react';
import { PetsContext } from '../context/PetsContext';
import PetCard from '../components/PetCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const { filteredPets, currentPage, totalPages, isLoading, error, fetchPets, goToPage } = useContext(PetsContext);

  useEffect(() => {
    fetchPets(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Pet</h1>
          <p className="text-xl mb-8">Browse available pets and start your adoption journey today</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Pet Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="spinner w-12 h-12"></div>
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No pets found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {/* Pet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredPets.map((pet) => (
                    <PetCard key={pet._id} pet={pet} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 rounded ${
                            currentPage === page
                              ? 'btn btn-primary'
                              : 'btn btn-secondary'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
                    >
                      Next <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
