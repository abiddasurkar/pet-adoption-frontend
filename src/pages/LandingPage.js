import React, { useContext, useEffect, useState, useRef } from 'react';
import { PetsContext } from '../context/PetsContext';
import PetCard from '../components/PetCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

export default function LandingPage() {
  const { filteredPets, currentPage, totalPages, isLoading, error, fetchPets, goToPage } = useContext(PetsContext);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Random pet video links from various sources
  const videos = [
  "https://videos.pexels.com/video-files/6588293/6588293-hd_1080_1920_30fps.mp4",
  "https://videos.pexels.com/video-files/2796082/2796082-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/7131832/7131832-uhd_1440_2732_30fps.mp4",
  "https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4"  
  ];

  useEffect(() => {
    fetchPets(1);
    
    // Show text for 2 seconds, then transition to video
    const textTimer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);

    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [showVideo, currentVideo]);

  const handleVideoEnd = () => {
    // Switch to next video when current ends
    setCurrentVideo((prev) => (prev + 1) % videos.length);
    setVideoLoaded(false);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        {showVideo && (
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              key={currentVideo}
              className="w-full h-full object-cover"
              muted={isMuted}
              onEnded={handleVideoEnd}
              onLoadedData={handleVideoLoad}
              preload="auto"
              playsInline
              crossOrigin="anonymous"
            >
              <source src={videos[currentVideo]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
            
            {/* Loading Spinner for Video */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-8 right-8 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        )}

        {/* Text Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className={`text-center text-white transition-all duration-1000 ${
            showVideo ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Find Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Perfect Pet
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Browse available pets and start your adoption journey today
            </p>
            
            {/* Animated CTA Button */}
            <div className={`transition-all duration-1000 delay-500 ${
              showVideo ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <button 
                onClick={() => document.getElementById('pets-section').scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden"
              >
                <span className="relative z-10">Browse Available Pets</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            onClick={() => document.getElementById('pets-section').scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="text-white text-sm mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-400/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rounded-full animate-float animation-delay-2000"></div>
      </section>

      {/* Main Content */}
      <div id="pets-section" className="max-w-7xl mx-auto px-4 py-16">
        {/* Search & Filter */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-purple-600">Lovable Pets</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Each one is waiting for a loving home. Find your perfect companion today.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
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
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading pets...</p>
                </div>
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🐾</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters to see more results.</p>
                <button 
                  onClick={() => {
                    // Reset filters logic would go here
                    document.querySelector('input[type="search"]').value = '';
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredPets.length}</span> pets
                  </p>
                </div>

                {/* Pet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredPets.map((pet) => (
                    <PetCard key={pet._id} pet={pet} />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                            currentPage === page
                              ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
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

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}