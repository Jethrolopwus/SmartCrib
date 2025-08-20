"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  ArrowRight,
  ArrowLeft,
  Star,
  ThumbsUp,
  Home,
  User,
} from "lucide-react";
import Link from "next/link";

function ReviewStep2() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ rating: 0, review: "" });
  return (
    <div>
      <div
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-black bg-white"
        style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/city-background-panoramic-view.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50"></div>
                <Home className="relative w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Share Your Experience
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto text-white"
            >
              Your insights matter. Help build trust in our real estate
              community through authentic reviews.
            </p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-medium text-white"
              >
                Step {currentStep} of 1
              </span>
              <span
                className="text-sm font-medium text-white"
              >
                {Math.round((currentStep / 1) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 1) * 100}%` }}
              ></div>
            </div>
          </div>
          <div
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            className="rounded-lg overflow-hidden backdrop-blur-sm border border-gray-200"
          >
            <div className="bg-blue-600 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-white mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Your Review
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Share your experience and rate the property
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8 animate-fade-in mt-4 p-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  User-Address
                </label>
                <input
                  type="text"
                  name="reviewTitle"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 text-lg"
                  placeholder="user's address"
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
              </div>
              <div className="space-y-4">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  ⭐ Overall Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span
                    className="ml-4 text-lg font-medium"
                    style={{ color: "#4b5563" }}
                  >
                    {formData.rating > 0 && (
                      <>
                        {formData.rating}/5 -{" "}
                        {formData.rating === 5
                          ? "Excellent"
                          : formData.rating === 4
                          ? "Very Good"
                          : formData.rating === 3
                          ? "Good"
                          : formData.rating === 2
                          ? "Fair"
                          : "Poor"}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  Listing Id
                </label>
                <input
                  type="text"
                  name="reviewTitle"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 text-lg"
                  placeholder="luxury-villa-01"
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
              </div>

              {/* Detailed Review */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  💬 Detailed Review *
                </label>
                <textarea
                  name="review"
                  rows={6}
                  maxLength={1000}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none text-lg"
                  placeholder="Share your detailed experience - what did you love? What could be improved? Help others make informed decisions... (minimum 50 characters)"
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: "#d1d5db" }}>
                    {formData.review.length}/1000 characters (minimum 50)
                  </div>
                  <div className="text-sm" style={{ color: "#d1d5db" }}>
                    💡 Tip: Be specific and honest
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="recommend"
                    className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 border-2"
                  />
                  <label
                    className="text-lg font-medium cursor-pointer"
                    style={{ color: "#4b5563" }}
                  >
                    <ThumbsUp className="w-5 h-5 inline mr-2" />I would
                    recommend this to others
                  </label>
                </div> */}
              </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center mt-8 mb-8 mx-6 pt-8 border-t border-gray-200">
              {/* <Link href="/reviewform">
                <button className="flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-300 transform hover:scale-105">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              </Link> */}

              <button className='flex items-center justify-end px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer'>
                <Send className="w-5 h-5 mr-2" />
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep2;
