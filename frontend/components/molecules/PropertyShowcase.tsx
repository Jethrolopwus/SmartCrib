"use client";
import { useTheme } from '@/app/theme-provider';

const PropertyShowcase = () => {
  const { theme } = useTheme();

  return (
    <section className="py-20" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            Featured Properties
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
            Discover amazing properties available for rent, swap, or sale on our decentralized platform
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Property Card 1 */}
          <div className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border" style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}>
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}>
                For Rent
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Modern Downtown Apartment
              </h3>
              <p className="mb-4" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                2 bed • 2 bath • 1,200 sq ft
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  $2,500/mo
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border" style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}>
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}>
                For Sale
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Suburban Family Home
              </h3>
              <p className="mb-4" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                4 bed • 3 bath • 2,500 sq ft
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  $450,000
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Property Card 3 */}
          <div className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border" style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}>
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}>
                For Swap
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Beachfront Condo
              </h3>
              <p className="mb-4" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                1 bed • 1 bath • 800 sq ft
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  Swap Available
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyShowcase; 