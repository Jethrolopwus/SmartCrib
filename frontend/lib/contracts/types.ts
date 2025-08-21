// TypeScript types for SmartCribsCore contract interactions
export type UserRole = 0 | 1 | 2; // Renter, Homeowner, Agent
export type TransactionType = 0 | 1 | 2; // Rent, Sale, Swap
export type ListingStatus = 0 | 1 | 2 | 3; // Active, Inactive, Rented, Sold
export type VerificationStatus = 0 | 1 | 2; // Pending, Verified, Rejected

// Contract struct types
export interface UserProfile {
  role: UserRole;
  fullName: string;
  profileHash: string;
  reputationScore: bigint;
  totalTransactions: bigint;
  isActive: boolean;
}

export interface PropertyDetails {
  location: string;
  size: bigint;
  bedrooms: bigint;
  bathrooms: bigint;
  propertyType: string;
  amenities: string;
  yearBuilt: bigint;
  furnished: boolean;
  petsAllowed: boolean;
  propertyHash: string;
}

export interface RentalTerms {
  minDuration: bigint;
  maxDuration: bigint;
  securityDeposit: bigint;
  utilitiesIncluded: boolean;
  moveInDate: string;
}

export interface SaleTerms {
  downPayment: bigint;
  financingAvailable: boolean;
  closingDate: string;
  inspectionRequired: boolean;
}

export interface PropertyListing {
  listingId: bigint;
  owner: string;
  transactionType: TransactionType;
  propertyDetails: PropertyDetails;
  price: bigint;
  paymentToken: string;
  duration: bigint;
  rentalTerms: RentalTerms;
  saleTerms: SaleTerms;
  ownershipProof: string;
  status: ListingStatus;
  verificationStatus: VerificationStatus;
  views: bigint;
  inquiries: bigint;
  createdAt: bigint;
}

export interface Review {
  reviewId: bigint;
  reviewer: string;
  reviewedUser: string;
  listingId: bigint;
  rating: bigint;
  comment: string;
  createdAt: bigint;
}

export interface PlatformStats {
  totalUsers: bigint;
  totalListings: bigint;
  totalTransactions: bigint;
  totalRevenue: bigint;
}

// Function parameter types
export interface CreatePropertyListingParams {
  transactionType: TransactionType;
  propertyDetails: PropertyDetails;
  price: bigint;
  paymentToken: string;
  duration: bigint;
  rentalTerms: RentalTerms;
  saleTerms: SaleTerms;
  ownershipProof: string;
}

export interface SubmitReviewParams {
  reviewedUser: string;
  listingId: bigint;
  rating: bigint;
  comment: string;
}

// Event types
export interface ListingCreatedEvent {
  listingId: bigint;
  owner: string;
  transactionType: TransactionType;
  timestamp: bigint;
}

export interface ReviewSubmittedEvent {
  reviewId: bigint;
  reviewer: string;
  reviewedUser: string;
  rating: bigint;
  timestamp: bigint;
}

export interface UserRegisteredEvent {
  user: string;
  role: UserRole;
  fullName: string;
  timestamp: bigint;
} 