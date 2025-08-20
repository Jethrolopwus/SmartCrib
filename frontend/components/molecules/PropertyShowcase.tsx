"use client";
import { useTheme } from '@/app/theme-provider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PropertyShowcase = () => {
  const { theme } = useTheme();
   const router = useRouter();

   const properties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      type: "For Rent",
      price: "$2,500/mo",
      beds: 2,
      baths: 2,
      sqft: 1200,
      gradient: "from-blue-400 to-purple-500",
      image: "/plant-green-city-amazing-skyscraper.jpg"
    },
    {
      id: 2,
      title: "Suburban Family Home",
      type: "For Sale",
      price: "$450,000",
      beds: 4,
      baths: 3,
      sqft: 2500,
      gradient: "from-green-400 to-blue-500",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 3,
      title: "Beachfront Condo",
      type: "For Swap",
      price: "Swap Available",
      beds: 1,
      baths: 1,
      sqft: 800,
      gradient: "from-purple-400 to-pink-500",
      image: "/swimming-pool.jpg"
    }
  ];

  const handleViewDetails = (propertyId: number) => {
    router.push(`/featuredetails/${propertyId}`);
  };

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
          {properties.map((property) => (
            <div key={property.id} className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border cursor-pointer" style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}>
              <div>
                <img className='h-48 relative w-full' src={property.image} alt={property.title} />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold" style={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }}>
                  {property.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  {property.title}
                </h3>
                <p className="mb-4" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                  {property.beds} bed • {property.baths} baths • {property.sqft} sqft
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.price}
                  </span>
                  <button onClick={() => handleViewDetails(property.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/pagedetails" className='flex justify-end'>
          <button className="px-6 py-3 mt-8 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-white/20">
            See More →
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PropertyShowcase; 