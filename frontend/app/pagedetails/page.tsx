"use client"
import React from 'react'
import { useTheme } from '@/app/theme-provider';

function DeatilsPage() {
    const { theme } = useTheme();
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
    },
    {
    id: 4,
    title: "Luxury Penthouse",
    type: "For Rent",
    price: "$5,200/mo",
    beds: 3,
    baths: 3,
    sqft: 2200,
    gradient: "from-yellow-400 to-orange-500",
    image: "/hotel-lobby-interior.jpg"
  },
  {
    id: 5,
    title: "Cozy Studio Loft",
    type: "For Rent",
    price: "$1,800/mo",
    beds: 1,
    baths: 1,
    sqft: 650,
    gradient: "from-pink-400 to-red-500",
    image: "/empty-front-desk-hotel-registration-area.jpg"
  },
  {
    id: 6,
    title: "Mountain Cabin Retreat",
    type: "For Sale",
    price: "$320,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    gradient: "from-green-500 to-teal-500",
    image: "/wooden-arbors-trees-mountains.jpg"
  },
  {
    id: 7,
    title: "Historic Townhouse",
    type: "For Sale",
    price: "$675,000",
    beds: 3,
    baths: 2,
    sqft: 2100,
    gradient: "from-indigo-400 to-purple-600",
    image: "/tree-growing-into-wall-christ-church-college-s-building-oxford.jpg"
  },
  {
    id: 8,
    title: "Lakefront Villa",
    type: "For Swap",
    price: "Swap Available",
    beds: 4,
    baths: 3,
    sqft: 2800,
    gradient: "from-blue-500 to-cyan-500",
    image: "/light-garden-luxury-pool-nature.jpg"
  },
  {
    id: 9,
    title: "Urban Industrial Loft",
    type: "For Rent",
    price: "$3,100/mo",
    beds: 2,
    baths: 2,
    sqft: 1400,
    gradient: "from-gray-500 to-slate-600",
    image: "/interior-airport-with-windows.jpg"
  },
  {
    id: 10,
    title: "Countryside Farmhouse",
    type: "For Sale",
    price: "$385,000",
    beds: 4,
    baths: 3,
    sqft: 2600,
    gradient: "from-amber-400 to-yellow-500",
    image: "/street-thailand-nature.jpg"
  },
  {
    id: 11,
    title: "City View High-Rise",
    type: "For Rent",
    price: "$2,800/mo",
    beds: 2,
    baths: 2,
    sqft: 1100,
    gradient: "from-violet-400 to-purple-500",
    image: "/modar-kajo-qnLIL2yrr_I-unsplash.jpg"
  },
  {
    id: 12,
    title: "Coastal Beach House",
    type: "For Swap",
    price: "Swap Available",
    beds: 3,
    baths: 2,
    sqft: 1900,
    gradient: "from-teal-400 to-blue-500",
    image: "/edu-lins--xxNaEBP8eE-unsplash.jpg"
  },
  {
    id: 13,
    title: "Minimalist Container Home",
    type: "For Sale",
    price: "$195,000",
    beds: 2,
    baths: 1,
    sqft: 1000,
    gradient: "from-slate-400 to-gray-600",
    image: "/ai-generated-house-design.jpg"
  },
  {
    id: 14,
    title: "Garden District Victorian",
    type: "For Sale",
    price: "$550,000",
    beds: 4,
    baths: 3,
    sqft: 2400,
    gradient: "from-rose-400 to-pink-500",
    image: "/martin-wemyss-4tcyzD4xkQM-unsplash.jpg"
  },
  {
    id: 15,
    title: "Tech Hub Micro Unit",
    type: "For Rent",
    price: "$1,600/mo",
    beds: 1,
    baths: 1,
    sqft: 450,
    gradient: "from-emerald-400 to-green-500",
    image: "/close-up-man-working-computer-chips.jpg"
  },
  {
    id: 16,
    title: "Desert Modern Oasis",
    type: "For Swap",
    price: "Swap Available",
    beds: 3,
    baths: 2,
    sqft: 2000,
    gradient: "from-orange-400 to-red-500",
    image: "/nomadic-architecture-desert.jpg"
  },
  {
    id: 17,
    title: "Waterfront Duplex",
    type: "For Sale",
    price: "$720,000",
    beds: 5,
    baths: 4,
    sqft: 3200,
    gradient: "from-cyan-400 to-blue-600",
    image: "/miami-luxury-house.jpg"
  },
  {
    id: 18,
    title: "Artistic Warehouse Conversion",
    type: "For Rent",
    price: "$2,600/mo",
    beds: 2,
    baths: 2,
    sqft: 1600,
    gradient: "from-fuchsia-400 to-purple-600",
    image: "/photorealistic-scene-with-warehouse-logistics-operations.jpg"
  }
  ];
  return (
    <div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-44 px-6 md:py-12 py-3 mt-20">
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default DeatilsPage
