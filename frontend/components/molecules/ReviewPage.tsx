"use client";
import { useState } from "react";
import { Star, User, MapPin, Home, Calendar, ThumbsUp, Filter, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTheme } from '@/app/theme-provider';


export default function ReviewsPage() {
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();

  // Mock review data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 5,
      date: "2024-08-15",
      propertyType: "Luxury Villa",
      location: "Victoria Island, Lagos",
      title: "Exceptional Service and Beautiful Property",
      review: "I recently purchased a stunning villa through this platform and the entire experience was outstanding. The property was exactly as described, the location is perfect, and the team was incredibly professional throughout the entire process. The virtual tour was accurate and the documentation process was seamless. Highly recommend!",
      pros: "Professional staff, accurate listings, smooth process",
      cons: "None that I can think of",
      experience: "purchase",
      recommend: true,
      helpful: 24
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "MC",
      rating: 4,
      date: "2024-08-12",
      propertyType: "Apartment",
      location: "Ikoyi, Lagos",
      title: "Great Rental Experience with Minor Issues",
      review: "Found my current apartment through this website and overall very satisfied. The search filters are excellent and helped me narrow down options quickly. The landlord was responsive and the property matches the description. Only issue was some minor maintenance that needed attention after moving in, but it was resolved promptly.",
      pros: "Easy search, responsive landlord, quick issue resolution",
      cons: "Minor maintenance issues initially",
      experience: "rental",
      recommend: true,
      helpful: 18
    },
  ];
  

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-indigo-900/20"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-60"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                <Star className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
            Customer Reviews
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90 drop-shadow-lg">
            Real experiences from our valued customers across Lagos and beyond
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 flex gap-6 items-center justify-center">
          {reviews.map((review) => (
            <div key={review.id} className="h-96 w-[450px] mt-6 bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">{review.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {(review.date)}
                      <span className="mx-2">•</span>
                      <span>{(review.experience)} {review.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Home className="w-4 h-4 mr-1" />
                  <span className="font-medium">{review.propertyType}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{review.location}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{review.title}</h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{review.review.length > 100 ? review.review.slice(0, 100) + "..." : review.review}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  {review.recommend && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Recommends this experience
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{review.helpful} people found this helpful</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        <Link href="/detailedreview" className='flex justify-end mr-36 mt-6'>
          <button className="px-6 py-3 mt-8 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-white/20">
            See More →
          </button>
        </Link>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}
      </div>
    // </div>
  );
}