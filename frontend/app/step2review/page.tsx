"use client";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  ArrowRight,
  ArrowLeft,
  Star,
  ThumbsUp,
  Home,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useSubmitReview } from '@/lib/contracts/hooks';

function ReviewStep2() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ 
    reviewedUser: "", 
    listingId: "", 
    rating: 0, 
    comment: "" 
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address, isConnected } = useAccount();
  const { submitReview, isPending, isConfirming, isSuccess, error, hash } = useSubmitReview();

  // Handle form data changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.reviewedUser) {
      newErrors.reviewedUser = "Please enter the reviewed user's address";
    } else if (!isValidAddress(formData.reviewedUser)) {
      newErrors.reviewedUser = "Please enter a valid Ethereum address";
    }

    if (!formData.listingId) {
      newErrors.listingId = "Please enter the listing ID";
    } else if (isNaN(Number(formData.listingId)) || Number(formData.listingId) < 0) {
      newErrors.listingId = "Please enter a valid listing ID";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.comment) {
      newErrors.comment = "Please enter a review comment";
    } else if (formData.comment.length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isConnected) {
      setErrors({ general: "Please connect your wallet first" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      submitReview([
        formData.reviewedUser as `0x${string}`,
        BigInt(formData.listingId),
        BigInt(formData.rating),
        formData.comment
      ]);
    } catch (err) {
      console.error("Error submitting review:", err);
      setErrors({ general: "Failed to submit review. Please try again." });
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitting(false);
      // Reset form on success
      setFormData({ reviewedUser: "", listingId: "", rating: 0, comment: "" });
      
      // Redirect to reviews page after a short delay to show the success message
      setTimeout(() => {
        router.push('/reviews-page');
      }, 2000);
    }
  }, [isSuccess, router]);

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
        <div className="max-w-3xl mx-auto mt-10">
          <div className="text-center mb-12">
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

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  Please connect your wallet to submit a review
                </span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Review submitted successfully! Transaction hash: {hash?.slice(0, 10)}...
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">
                  {error.message || "Failed to submit review. Please try again."}
                </span>
              </div>
            </div>
          )}

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
              {/* Reviewed User Address */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  Reviewed User Address *
                </label>
                <input
                  type="text"
                  value={formData.reviewedUser}
                  onChange={(e) => handleInputChange('reviewedUser', e.target.value)}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 text-lg ${
                    errors.reviewedUser ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0x..."
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
                {errors.reviewedUser && (
                  <p className="text-red-500 text-sm mt-1">{errors.reviewedUser}</p>
                )}
              </div>

              {/* Rating */}
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
                      onClick={() => handleInputChange('rating', star)}
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
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                )}
              </div>

              {/* Listing ID */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  Listing ID *
                </label>
                <input
                  type="number"
                  value={formData.listingId}
                  onChange={(e) => handleInputChange('listingId', e.target.value)}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 text-lg ${
                    errors.listingId ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter listing ID"
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
                {errors.listingId && (
                  <p className="text-red-500 text-sm mt-1">{errors.listingId}</p>
                )}
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: "#4b5563" }}
                >
                  💬 Review Comment *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  rows={6}
                  maxLength={1000}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 resize-none text-lg ${
                    errors.comment ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Share your detailed experience - what did you love? What could be improved? Help others make informed decisions... (minimum 10 characters)"
                  style={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: "#d1d5db" }}>
                    {formData.comment.length}/1000 characters (minimum 10)
                  </div>
                  <div className="text-sm" style={{ color: "#d1d5db" }}>
                    💡 Tip: Be specific and honest
                  </div>
                </div>
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center mt-8 mb-8 mx-6 pt-8 border-t border-gray-200">
              <button 
                onClick={handleSubmit}
                disabled={!isConnected || isPending || isConfirming || isSubmitting}
                className={`flex items-center justify-end px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer ${
                  !isConnected || isPending || isConfirming || isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:from-emerald-700 hover:to-blue-700'
                }`}
              >
                {isPending || isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isPending ? 'Confirming...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep2;
