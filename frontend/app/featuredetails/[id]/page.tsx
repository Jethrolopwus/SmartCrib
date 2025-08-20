// import React from 'react'

// function DetailsPage() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default DetailsPage
"use client";
import { useTheme } from '@/app/theme-provider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Home, Bath, Square, Wifi, Car, Shield, Heart } from 'lucide-react';
import { useState } from 'react';

interface PropertyDetailsProps {
  propertyId: string;
}

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock property data - in real app, fetch based on propertyId
  const propertyData: { [key: string]: any } = {
    "1": {
      id: 1,
      title: "Modern Downtown Apartment",
      type: "For Rent",
      price: "$2,500",
      period: "/month",
      beds: 2,
      baths: 2,
      sqft: 1200,
      address: "123 Downtown Street, City Center, NY 10001",
      description: "Experience luxury living in this stunning modern apartment located in the heart of downtown. This beautifully designed space features high-end finishes, floor-to-ceiling windows, and breathtaking city views. Perfect for professionals seeking convenience and style.",
      features: [
        "Floor-to-ceiling windows",
        "Hardwood floors",
        "Stainless steel appliances",
        "In-unit washer/dryer",
        "Central air conditioning",
        "Granite countertops"
      ],
      amenities: [
        { icon: Wifi, name: "High-speed WiFi" },
        { icon: Car, name: "Parking included" },
        { icon: Shield, name: "24/7 security" },
        { icon: Home, name: "Gym access" }
      ],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
      ],
      available: "Available Now",
      owner: {
        name: "Sarah Johnson",
        verified: true,
        rating: 4.9,
        properties: 12
      }
    },
    "2": {
      id: 2,
      title: "Suburban Family Home",
      type: "For Sale",
      price: "$450,000",
      period: "",
      beds: 4,
      baths: 3,
      sqft: 2500,
      address: "456 Maple Avenue, Suburbia, NY 11542",
      description: "Beautiful family home in a quiet suburban neighborhood. This spacious property offers everything your family needs with a large backyard, modern kitchen, and close proximity to excellent schools. Move-in ready with recent updates throughout.",
      features: [
        "Large backyard",
        "Modern kitchen",
        "Master suite with walk-in closet",
        "Two-car garage",
        "Finished basement",
        "New HVAC system"
      ],
      amenities: [
        { icon: Car, name: "2-car garage" },
        { icon: Home, name: "Basement" },
        { icon: Square, name: "Large yard" },
        { icon: Shield, name: "Security system" }
      ],
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop"
      ],
      available: "Available Now",
      owner: {
        name: "Michael Chen",
        verified: true,
        rating: 4.8,
        properties: 8
      }
    },
    "3": {
      id: 3,
      title: "Beachfront Condo",
      type: "For Swap",
      price: "Swap Available",
      period: "",
      beds: 1,
      baths: 1,
      sqft: 800,
      address: "789 Ocean Drive, Beachside, FL 33139",
      description: "Wake up to ocean views every day in this stunning beachfront condo. This cozy yet elegant space offers direct beach access, modern amenities, and a prime location. Perfect for vacation rentals or permanent residence by the sea.",
      features: [
        "Ocean views",
        "Direct beach access",
        "Balcony",
        "Modern kitchen",
        "Resort-style amenities",
        "Hurricane-impact windows"
      ],
      amenities: [
        { icon: Wifi, name: "High-speed WiFi" },
        { icon: Car, name: "Valet parking" },
        { icon: Home, name: "Pool & spa" },
        { icon: Shield, name: "Concierge" }
      ],
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      available: "Available for swap",
      owner: {
        name: "Emma Rodriguez",
        verified: true,
        rating: 4.7,
        properties: 15
      }
    }
  };

  const property = propertyData[propertyId];

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 p-4" style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button className="p-2 rounded-full transition-colors hover:bg-red-50">
            <Heart size={24} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {property.images.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {property.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Property ${index + 1}`}
                className={`h-24 rounded-lg object-cover cursor-pointer transition-opacity ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-2" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    <MapPin size={16} />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.price}
                    <span className="text-lg font-normal" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                      {property.period}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-semibold inline-block mt-2" style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}>
                    {property.type}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-t border-b" style={{ 
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.beds}
                  </div>
                  <div className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    Bedrooms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.baths}
                  </div>
                  <div className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    Bathrooms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.sqft.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    Sq Ft
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.available}
                  </div>
                  <div className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    Availability
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Description
              </h2>
              <p className="leading-relaxed" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon size={20} className="text-blue-500" />
                    <span style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Property Owner
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {property.owner.name}
                  </div>
                  <div className="text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    ⭐ {property.owner.rating} • {property.owner.properties} properties
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Owner
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl" style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 border rounded-lg font-medium transition-colors" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent'
                }}>
                  Schedule Tour
                </button>
                <button className="w-full py-2 px-4 border rounded-lg font-medium transition-colors" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent'
                }}>
                  Request Info
                </button>
                <button className="w-full py-2 px-4 border rounded-lg font-medium transition-colors" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent'
                }}>
                  Save Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;