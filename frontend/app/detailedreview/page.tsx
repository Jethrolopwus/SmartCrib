import React from 'react'
import { Star, User, MapPin, Home, Calendar, ThumbsUp, Filter, Search, ChevronDown } from "lucide-react";
import Link from 'next/link';

function DetailedReview() {
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
    {
      id: 3,
      name: "Aisha Okafor",
      avatar: "AO",
      rating: 5,
      date: "2024-08-08",
      propertyType: "Commercial Space",
      location: "Lekki Phase 1, Lagos",
      title: "Perfect Office Space for Our Growing Business",
      review: "We needed commercial space for our expanding tech startup and found exactly what we were looking for. The property details were comprehensive, the virtual tour was helpful, and the negotiation process was transparent. The location has great connectivity and the building amenities are top-notch. Our team loves the new office!",
      pros: "Detailed listings, transparent process, great amenities",
      cons: "Parking could be better",
      experience: "commercial",
      recommend: true,
      helpful: 31
    },
    {
      id: 4,
      name: "David Williams",
      avatar: "DW",
      rating: 3,
      date: "2024-08-05",
      propertyType: "House",
      location: "Gbagada, Lagos",
      title: "Average Experience, Room for Improvement",
      review: "Used the platform to find a family home. While we eventually found something suitable, the process took longer than expected. Some listings were outdated and a few properties we viewed didn't match their online descriptions. The customer service team was helpful when contacted, but more proactive communication would have been appreciated.",
      pros: "Eventually found good property, helpful customer service",
      cons: "Some outdated listings, communication could be better",
      experience: "purchase",
      recommend: false,
      helpful: 12
    },
    {
      id: 5,
      name: "Fatima Al-Hassan",
      avatar: "FA",
      rating: 5,
      date: "2024-08-02",
      propertyType: "Condo",
      location: "Banana Island, Lagos",
      title: "Luxury Living Made Easy",
      review: "Absolutely thrilled with my new condo purchase! The entire experience from browsing to closing was seamless. The property manager was knowledgeable, the legal team handled all documentation efficiently, and the property exceeds expectations. The amenities are world-class and the community is wonderful. Best investment decision I've made!",
      pros: "Seamless process, excellent amenities, professional team",
      cons: "Premium pricing, but worth every penny",
      experience: "purchase",
      recommend: true,
      helpful: 28
    },
    {
      id: 6,
      name: "James Adebayo",
      avatar: "JA",
      rating: 4,
      date: "2024-07-28",
      propertyType: "Apartment",
      location: "Surulere, Lagos",
      title: "Good Value for Money Rental",
      review: "Found a decent apartment for my family at a reasonable price. The search functionality is user-friendly and the property photos were accurate. The landlord is understanding and the neighborhood is safe and convenient. Only minor complaint is that some amenities mentioned weren't fully functional, but they're being fixed gradually.",
      pros: "Good value, safe location, user-friendly platform",
      cons: "Some amenities needed maintenance",
      experience: "rental",
      recommend: true,
      helpful: 15
    }
  ];
  return (
    <div>
      <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{reviews.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current ml-2" />
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {Math.round((reviews.filter(r => r.recommend).length / reviews.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Would Recommend</div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {reviews.reduce((sum, r) => sum + r.helpful, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Helpful Votes</div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {reviews.map((review) => (
            <div key={review.id} className="h-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
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

              <p className="text-gray-700 leading-relaxed mb-6">{review.review}</p>

              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {review.pros && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <h5 className="font-semibold text-green-800 mb-2">👍 What they loved:</h5>
                      <p className="text-green-700 text-sm">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-amber-50 rounded-xl p-4">
                      <h5 className="font-semibold text-amber-800 mb-2">👎 Areas for improvement:</h5>
                      <p className="text-amber-700 text-sm">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

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
        <Link href="/pagedetails" className='flex justify-end'>
          <button className="px-6 py-3 mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-white/20">
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
    </div>
  )
}

export default DetailedReview
