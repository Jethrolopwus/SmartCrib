"use client";

import AmenitiesSection from "@/components/molecules/AmenitiesSection";
import ContactSection from "@/components/molecules/ContactSection";
import ImagesSection from "@/components/molecules/ImagesSection";
import LocationSection from "@/components/molecules/LocationSection";
import PropertySection from "@/components/molecules/PropertySection";
import useMultistepForm from "@/components/useMultistepForm";
import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

type AmenityTypes = {
  parking: boolean;
  garden: boolean;
  swimmingPool: boolean;
  balcony: boolean;
  gym: boolean;
  fireplace: boolean;
  securitySystem: boolean;
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
  const methods = useForm<ListingData>({
    defaultValues: {
      propertyTitle: "",
      yearBuilt: 0,
      furnished: false,
      petsAllowed: false,
      propertyHash: "",
      paymentTokenAddress: "",
      ownershipProof: "",
      transactionType: 0,
      rentalTerms: {
        minDuration: 0,
        maxDuration: 0,
        securityDeposit: 0,
        utilitiesIncluded: false,
        moveInDate: "",
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
        downpayment: 0,
        financingAvailable: false,
        closingDate: "",
        inspectionRequired: true,
      },
      description: "",
      propertyType: "",
      listingType: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      areaUnit: "sqft",
      price: 0,
      currency: "USD",
      address: "",
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

  const onSubmit: SubmitHandler<ListingData> = (data: ListingData) => {
    if (!isLastStep) {
      next();
    } else {
      console.log("Listing Data Submitted:", data);
      if (data.images) {
        const filesArray = Array.from(data.images);
        console.log("Files:", filesArray);
      }
      alert(`Submtted successfully`);
    }
  };

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
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full
      hover:bg-blue-700 focus:outline-none focus:ring-4
      focus:ring-blue-500 focus:ring-opacity-50
      transition duration-300 ease-in-out shadow-md
      transform hover:scale-105">
                        Previous
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full
      hover:bg-blue-700 focus:outline-none focus:ring-4
      focus:ring-blue-500 focus:ring-opacity-50
      transition duration-300 ease-in-out shadow-md 
      transform hover:scale-105">
                      {isLastStep ? "Submit" : "Next"}
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
