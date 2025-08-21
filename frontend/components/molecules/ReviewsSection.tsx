"use client";
import { useTheme } from '@/app/theme-provider';
import Link from 'next/link';
import { Star } from "lucide-react";

const ReviewsSection = () => {
  const { theme } = useTheme();

  const reviews = [
    {
      id: 1,
      name: "Andrew Abba",
      avatar: "AA",
      rating: 4,
      reviewCount: 28,
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
      reviewCount: 15,
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
      reviewCount: 42,
      date: "18th April, 2025",
      propertyName: "No 15. victoria island...",
      review: "Excellent property with great amenities and responsive management...",
      image: "/3d-rendering-house-model.jpg"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            Customer Reviews
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
            Real experiences from our valued customers across Lagos and beyond
          </p>
        </div>
        
        <Link href="/reviews-page" className='flex justify-end mb-4'>
          <button className="px-6 py-3 mt-8 rounded-lg bg-blue-700 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-white/20">
            See More →
          </button>
        </Link>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border" style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }}>
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={review.image}
                  alt={review.propertyName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Property Name */}
                <h3 className="font-semibold text-lg mb-2" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
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
                  <span className="ml-2 text-sm" style={{ color: theme === 'dark' ? '#d1d5db' : '#6b7280' }}>
                    {review.rating} ({review.reviewCount} reviews)
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-sm mb-4 line-clamp-2" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                  "{review.review}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-gray-600">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                      {review.name}
                    </p>
                    <p className="text-xs" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                      {review.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection; 