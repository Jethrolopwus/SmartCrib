"use client";
import React, { useState } from 'react'
import { Star, User, MapPin, Home, Calendar, ThumbsUp, Filter, Search, ChevronDown } from "lucide-react";
import Link from 'next/link';

function DetailedReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Apartments');

  const reviews = [
    {
      id: 1,
      name: "Andrew Abba",
      avatar: "AA",
      rating: 4,
      date: "20th April, 2025",
      propertyName: "No 1. kumuye strt...",
      review: "Great location but maintenance issues were a constant problem during my stay...",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 2,
      name: "Jessica Lee",
      avatar: "JL",
      rating: 3.5,
      date: "22nd April, 2025",
      propertyName: "No 10. banana ave...",
      review: "Comfortable stay, but the internet connection was unreliable at times...",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 3,
      name: "Michael Chen",
      avatar: "MC",
      rating: 4,
      date: "18th April, 2025",
      propertyName: "No 15. victoria island...",
      review: "Excellent property with great amenities and responsive management...",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 5,
      date: "16th April, 2025",
      propertyName: "No 8. lekki phase 1...",
      review: "Absolutely loved this place! Clean, modern, and perfect location...",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 5,
      name: "David Williams",
      avatar: "DW",
      rating: 4.5,
      date: "14th April, 2025",
      propertyName: "No 12. surulere...",
      review: "Great value for money. The neighborhood is safe and convenient...",
      image: "/3d-rendering-house-model.jpg"
    },
    {
      id: 6,
      name: "Fatima Al-Hassan",
      avatar: "FA",
      rating: 4,
      date: "12th April, 2025",
      propertyName: "No 5. ikoyi...",
      review: "Beautiful property with stunning views. Highly recommended...",
      image: "/3d-rendering-house-model.jpg"
    }
  ];

  const filteredReviews = reviews.filter(review =>
    review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Search Bar */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Filter Reviews:</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by home address e.g 62 Patigi-Ejebje Road, Patigi, Kwara"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setSelectedFilter(selectedFilter === 'All Apartments' ? 'Filtered' : 'All Apartments')}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className="text-gray-700">{selectedFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={review.image}
                  alt={review.propertyName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Property Name */}
                <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                  {review.propertyName}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(review.rating) 
                            ? "text-yellow-400 fill-current" 
                            : star === Math.ceil(review.rating) && review.rating % 1 !== 0
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {review.rating} ({Math.floor(Math.random() * 50) + 10} reviews)
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  "{review.review}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-gray-600">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailedReview
