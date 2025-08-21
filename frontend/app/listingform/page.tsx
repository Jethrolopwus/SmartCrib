"use client";

import AmenitiesSection from "@/components/molecules/AmenitiesSection";
import ContactSection from "@/components/molecules/ContactSection";
import ImagesSection from "@/components/molecules/ImagesSection";
import LocationSection from "@/components/molecules/LocationSection";
import PropertySection from "@/components/molecules/PropertySection";
import useMultistepForm from "@/components/useMultistepForm";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useAccount } from 'wagmi';
import { useCreatePropertyListing } from '@/lib/contracts/hooks';
import { TransactionType } from '@/lib/contracts/types';
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

type AmenityTypes = {
  parking: boolean;
  garden: boolean;
  swimmingPool: boolean;
  balcony: boolean;
  gym: boolean;
  fireplace: boolean;
  securitySystem: boolean;
  dishwasher: boolean;
};

interface PreviewFile {
  name: string;
  url: string;
}

interface RentalTerms {
  minDuration: number;
  maxDuration: number;
  securityDeposit: number;
  utilitiesIncluded: boolean;
  moveInDate: string;
}

interface SwapTerms {
  desiredLocation: string;
  minSize: number;
  maxSize: number;
  swapDuration: string;
  swapDate: string;
  flexibleDates: boolean;
}

interface SaleTerms {
  downpayment: number;
  financingAvailable: boolean;
  closingDate: string;
  inspectionRequired: boolean;
}

export type ListingData = {
  propertyTitle: string;
  description: string;
  propertyType: string;
  listingType: "rent" | "sale" | "swap" | "";
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  furnished: boolean;
  transactionType: number;
  petsAllowed: boolean;
  propertyHash: string;
  paymentTokenAddress: string;
  rentalTerms: RentalTerms;
  swapTerms: SwapTerms;
  saleTerms: SaleTerms;
  ownershipProof: string;
  duration: number;
  area: number;
  areaUnit: "sqft" | "sqm";
  price: number;
  currency: string;
  address: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  country: string;
  amenities: AmenityTypes;
  images: FileList | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

function ListingFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { address, isConnected } = useAccount();
  const { createPropertyListing, isPending, isConfirming, isSuccess, error, hash } = useCreatePropertyListing();

  const methods = useForm<ListingData>({
    defaultValues: {
      propertyTitle: "",
      yearBuilt: 2009,
      furnished: true,
      petsAllowed: true,
      propertyHash: "cool",
      paymentTokenAddress: "0x062189AFd7220eEC9995E0B628D7Ccc217687329",
      ownershipProof: "yes",
      transactionType: 2,
      rentalTerms: {
        minDuration: 1,
        maxDuration: 3,
        securityDeposit: 2,
        utilitiesIncluded: true,
        moveInDate: "2000",
      },
      swapTerms: {
        desiredLocation: "",
        minSize: 0,
        maxSize: 0,
        swapDuration: "",
        flexibleDates: false,
        swapDate: "",
      },
      saleTerms: {
        downpayment: 1,
        financingAvailable: true,
        closingDate: "2020",
        inspectionRequired: true,
      },
      description: "",
      propertyType: "rent",
      listingType: "rent",
      bedrooms: 1,
      bathrooms: 1,
      area: 2,
      areaUnit: "sqft",
      price: 2,
      currency: "USD",
      address: "yes",
      city: "",
      stateProvince: "",
      zipPostalCode: "",
      country: "",
      amenities: {
        parking: false,
        garden: false,
        swimmingPool: false,
        balcony: false,
        gym: false,
        fireplace: false,
        securitySystem: false,
        dishwasher: true,
      },
      images: null,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const {
    step,
    back,
    currentStepIndex,
    goTo,
    next,
    steps,
    isFirstStep,
    isLastStep,
  } = useMultistepForm([
    <PropertySection />,
    <LocationSection />,
    <AmenitiesSection />,
    <ImagesSection />,
    <ContactSection />,
  ]);

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Convert amenities object to string
  const amenitiesToString = (amenities: AmenityTypes): string => {
    const activeAmenities = Object.entries(amenities)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    return activeAmenities.join(',');
  };

  // Validate form data
  const validateFormData = (data: ListingData): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!data.propertyTitle.trim()) {
      newErrors.propertyTitle = "Property title is required";
    }

    if (!data.propertyType.trim()) {
      newErrors.propertyType = "Property type is required";
    }

    if (data.bedrooms <= 0) {
      newErrors.bedrooms = "Number of bedrooms must be positive";
    }

    if (data.bathrooms <= 0) {
      newErrors.bathrooms = "Number of bathrooms must be positive";
    }

    if (data.area <= 0) {
      newErrors.area = "Property area must be positive";
    }

    if (data.price <= 0) {
      newErrors.price = "Price must be positive";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!data.paymentTokenAddress.trim()) {
      newErrors.paymentTokenAddress = "Payment token address is required";
    } else if (!isValidAddress(data.paymentTokenAddress)) {
      newErrors.paymentTokenAddress = "Please enter a valid Ethereum address";
    }

    if (!data.ownershipProof.trim()) {
      newErrors.ownershipProof = "Ownership proof is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit: SubmitHandler<ListingData> = async (data: ListingData) => {
    if (!isLastStep) {
      next();
      return;
    }

    // Final validation and submission
    if (!isConnected) {
      setErrors({ general: "Please connect your wallet first" });
      return;
    }

    if (!validateFormData(data)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert listing type to transaction type (2 for rent, 1 for sale)
      const transactionType: TransactionType = data.listingType === "rent" ? 2 : 1;

      // Prepare property details
      const propertyDetails = {
        location: data.address, // Use address directly as location
        size: BigInt(data.area),
        bedrooms: BigInt(data.bedrooms),
        bathrooms: BigInt(data.bathrooms),
        propertyType: data.propertyType,
        amenities: amenitiesToString(data.amenities),
        yearBuilt: BigInt(data.yearBuilt),
        furnished: data.furnished,
        petsAllowed: data.petsAllowed,
        propertyHash: data.propertyHash,
      };

      // Prepare rental terms
      const rentalTerms = {
        minDuration: BigInt(data.rentalTerms.minDuration),
        maxDuration: BigInt(data.rentalTerms.maxDuration),
        securityDeposit: BigInt(data.rentalTerms.securityDeposit),
        utilitiesIncluded: data.rentalTerms.utilitiesIncluded,
        moveInDate: data.rentalTerms.moveInDate,
      };

      // Prepare sale terms
      const saleTerms = {
        downPayment: BigInt(data.saleTerms.downpayment),
        financingAvailable: data.saleTerms.financingAvailable,
        closingDate: data.saleTerms.closingDate,
        inspectionRequired: data.saleTerms.inspectionRequired,
      };

      // Call smart contract with exact data structure
      createPropertyListing([
        transactionType,
        propertyDetails,
        BigInt(data.price),
        data.paymentTokenAddress as `0x${string}`,
        BigInt(data.duration),
        rentalTerms,
        saleTerms,
        data.ownershipProof,
      ]);

    } catch (err) {
      console.error("Error submitting listing:", err);
      setErrors({ general: "Failed to submit listing. Please try again." });
      setIsSubmitting(false);
    }
  };

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitting(false);
      // Reset form on success
      methods.reset();
    }
  }, [isSuccess, methods]);

  const progressPercentage =
    ((currentStepIndex + 1 - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <div
        className={`min-h-screen w-full brightness-95 lg:p-4 sm:p-6 flex items-center justify-center font-sans`}
        style={{
          backgroundImage: "url('/3d-rendering-house-model.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}>
        <main className="bg-transparent lg:p-20 rounded-xl w-11/12 mx-auto ">
          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">
                  Please connect your wallet to create a property listing
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
                  Property listing created successfully! Transaction hash: {hash?.slice(0, 10)}...
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
                  {error.message || "Failed to create listing. Please try again."}
                </span>
              </div>
            </div>
          )}

          <div className="mb-8 lg:p-5 ">
            <div className="flex justify-between items-center mb-2">
              <span className=" font-sans lg:text-5xl text-2xl text-nowrap text-blue-900 p-2 rounded-lg shadow backdrop-blur-lg mr-4 font-extrabold ">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-lg text-blue-900 mr-10 text-nowrap font-medium lg:text-2xl p-2 rounded-lg shadow backdrop-blur-lg">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="lg:space-y-5 w-full">
              <div className="flex flex-col lg:gap-10 ">
                <fieldset className="flex flex-col">
                  {step}
                  <div
                    className={`lg:px-36 py-10 rounded-b-2xl w-full lg:w-3/4 bg-white/90 mx-auto flex p-5 
    ${isFirstStep ? "justify-between" : "justify-end"}`}>
                    {isFirstStep && (
                      <button
                        type="button"
                        onClick={back}
                        className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full
      hover:bg-blue-700 focus:outline-none focus:ring-4
      focus:ring-blue-500 focus:ring-opacity-50
      transition duration-300 ease-in-out shadow-md
      transform hover:scale-105">
                        Previous
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!isConnected || isPending || isConfirming || isSubmitting}
                      className={`px-8 py-3 text-white font-bold rounded-full
      focus:outline-none focus:ring-4
      focus:ring-blue-500 focus:ring-opacity-50
      transition duration-300 ease-in-out shadow-md 
      transform hover:scale-105 ${
        !isConnected || isPending || isConfirming || isSubmitting
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-700 hover:bg-blue-700'
      }`}
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                          {isPending ? 'Confirming...' : 'Processing...'}
                        </>
                      ) : (
                        isLastStep ? "Submit Listing" : "Next"
                      )}
                    </button>
                  </div>
                </fieldset>
              </div>
            </form>
          </FormProvider>
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default ListingFormPage;
