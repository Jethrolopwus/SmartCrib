"use client";

import React from "react";

import { useForm, useFormContext } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";
import { Suspense } from "react";
import Spinner from "../atoms/Spinner";


const PropertySection = () => {
  const RentalTerms = React.lazy(() => import("./RentalTerms"));
  const SaleTerms = React.lazy(() => import("./SaleTerms"));
  const SwapTerms = React.lazy(() => import("./SwapTerms"));

  const [mounted, setMounted] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useFormContext<ListingData>();

  const onSubmit = (data: ListingData) => {
    console.log(data); // Log the single selected country
  };

  const listingType = watch("listingType");

  function DelayedFallback({
    delay = 300,
    children,
  }: {
    delay?: number;
    children: React.ReactNode;
  }) {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return show ? children : null;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default values to match smart contract requirements
  useEffect(() => {
    if (mounted) {
      setValue("transactionType", 2);
      setValue("propertyType", "rent");
      setValue("listingType", "rent");
      setValue("bedrooms", 1);
      setValue("bathrooms", 1);
      setValue("area", 2);
      setValue("price", 2);
      setValue("yearBuilt", 2009);
      setValue("furnished", true);
      setValue("petsAllowed", true);
      setValue("propertyHash", "cool");
      setValue("paymentTokenAddress", "0x062189AFd7220eEC9995E0B628D7Ccc217687329");
      setValue("ownershipProof", "yes");
      setValue("address", "yes");
      setValue("rentalTerms.minDuration", 1);
      setValue("rentalTerms.maxDuration", 3);
      setValue("rentalTerms.securityDeposit", 2);
      setValue("rentalTerms.utilitiesIncluded", true);
      setValue("rentalTerms.moveInDate", "2000");
      setValue("saleTerms.downpayment", 1);
      setValue("saleTerms.financingAvailable", true);
      setValue("saleTerms.closingDate", "2020");
      setValue("saleTerms.inspectionRequired", true);
      setValue("amenities.dishwasher", true);
    }
  }, [mounted, setValue]);

  if (!mounted) return null;

  const ErrorMessage = ({ field }: { field?: { message?: string } }) =>
    field ? <p className="text-red-500 text-xs mt-1">{field.message}</p> : null;

  const inputClassStyles = `p-4 focus:outline border border-zinc-300 text-stone-500 w-full rounded-2xl outline-none bg-zinc-200`;
  const labelTextStyles = `lg:text-xl font-light text-stone-700 text-lg`;
  const textAreaInputStyles = `h-56 rounded-2xl border border-zinc-300 w-full p-5 outline-none`;
  
  return (
    <>
      {/* Property Section */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-t-2xl bg-white/90 lg:p-5 w-full lg:w-3/4 flex flex-col mx-auto items-start">
        <h2 className="lg:text-3xl text-lg font-semibold lg:font-light py-2 lg:w-4/5 mx-auto">
          Property Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 border border-zinc-400 p-2 lg:p-10 rounded-2xl">
          <div className="flex flex-col gap-1.5">
            <label className={labelTextStyles} htmlFor="propertyTitle">
              Property Title
            </label>
            <input
              type="text"
              id="propertyTitle"
              {...register("propertyTitle", {
                required: "Property title is required",
              })}
              className={inputClassStyles}
              placeholder="e.g., Beautiful Family Home with Garden"
            />
            <ErrorMessage field={errors.propertyTitle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelTextStyles} htmlFor="propertyType">
              Property Type
            </label>
            <select
              id="propertyType"
              {...register("propertyType", {
                required: "Property type is required",
              })}
              className={inputClassStyles}>
              <option value="">Select Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condominium</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>
            <ErrorMessage field={errors.propertyType} />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className={labelTextStyles}>
                Description
              </label>
            </div>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              className={textAreaInputStyles}
              placeholder="Provide a detailed description of the property..."></textarea>
            <ErrorMessage field={errors.description} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bedrooms" className={labelTextStyles}>
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              {...register("bedrooms", {
                required: "Bedrooms are required",
                min: {
                  value: 0,
                  message: "Bedrooms cannot be negative",
                },
                valueAsNumber: true, // Crucial for number type
              })}
              className={inputClassStyles}
              placeholder="e.g., 3"
            />
            <ErrorMessage field={errors.bedrooms} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bathrooms" className={labelTextStyles}>
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              className={inputClassStyles}
              {...register("bathrooms", {
                required: "Bathrooms are required",
                min: {
                  value: 0,
                  message: "Bathrooms cannot be negative",
                },
                valueAsNumber: true,
              })}
              placeholder="e.g., 2.5"
              step="0.5"
            />
            <ErrorMessage field={errors.bathrooms} />
          </div>

          {/* Improved Area and Area Unit Section */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="area" className={labelTextStyles}>
              Area
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                id="area"
                {...register("area", {
                  required: "Area is required",
                  min: { value: 0, message: "Area cannot be negative" },
                  valueAsNumber: true,
                })}
                placeholder="e.g., 1500"
                className={`${inputClassStyles} flex-1`}
              />
              <select
                id="areaUnit"
                {...register("areaUnit")}
                className={`${inputClassStyles} w-24 min-w-24`}>
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq M</option>
              </select>
            </div>
            <ErrorMessage field={errors.area} />
          </div>

          {/* Improved Price and Currency Section */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className={labelTextStyles}>
              Price
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                id="price"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                  valueAsNumber: true,
                })}
                className={`${inputClassStyles} flex-1`}
                placeholder="e.g., 250000"
              />
              <select
                id="currency"
                {...register("currency")}
                className={`${inputClassStyles} w-20 min-w-20`}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <ErrorMessage field={errors.price} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelTextStyles} htmlFor="transactionType">
              Transaction type
            </label>
            <input
              type="text"
              id="transactionType"
              {...register("transactionType", {
                required: "Trasaction type is required",
              })}
              className={inputClassStyles}
              // placeholder="e.g., Beautiful Family Home with Garden"
            />
            <ErrorMessage field={errors.transactionType} />
          </div>

          <div>
            <div className="flex flex-col gap-1.5">
              <label className={labelTextStyles} htmlFor="transactionType">
                Year Built
              </label>
              <input
                type="number"
                id="yearBuilt"
                {...register("yearBuilt", {
                  required: "Year of Building completion is required",
                })}
                className={inputClassStyles}
                // placeholder="e.g., Beautiful Family Home with Garden"
              />
              <ErrorMessage field={errors.yearBuilt} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelTextStyles} htmlFor="propertyTitle">
              Property Hash
            </label>
            <input
              type="text"
              id="propertyHash"
              {...register("propertyHash", {
                required: "Property hash is required",
              })}
              className={inputClassStyles}
              // placeholder="e.g., Beautiful Family Home with Garden"
            />
            <ErrorMessage field={errors.propertyHash} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelTextStyles} htmlFor="paymentTokenAddress">
              Payment Token Address
            </label>
            <input
              className={inputClassStyles}
              type="text"
              id="paymentTokenAddress"
              placeholder="Payment token"
              {...register("paymentTokenAddress", { required: true })}
            />
            <ErrorMessage field={errors.paymentTokenAddress} />
          </div>

          <div>
            <label htmlFor="duration" className={labelTextStyles}>
              Duration
            </label>
            <input
              className={inputClassStyles}
              {...register("duration", { required: true })}
              type="date"
              id="duration"
            />

            <ErrorMessage field={errors.duration} />
          </div>

          <div>
            <label htmlFor="ownershipProof" className={labelTextStyles}>
              Proof of Ownership
            </label>
            <input
              className={inputClassStyles}
              {...register("ownershipProof", { required: true })}
              type="string"
              id="ownershipProof"
            />

            <ErrorMessage field={errors.ownershipProof} />
          </div>

          {/* Improved Listing Type Section */}
          <div className="md:col-span-2">
            <label className={`${labelTextStyles} block mb-3`}>Listing Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-zinc-300 rounded-xl bg-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  value="sale"
                  {...register("listingType", {
                    required: "Listing type is required",
                  })}
                  className="form-radio text-blue-600 w-4 h-4 mr-3"
                />
                <span className="text-gray-700 font-medium">For Sale</span>
              </label>
              <label className="flex items-center p-3 border border-zinc-300 rounded-xl bg-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  value="rent"
                  {...register("listingType", {
                    required: "Listing type is required",
                  })}
                  className="form-radio text-blue-600 w-4 h-4 mr-3"
                />
                <span className="text-gray-700 font-medium">For Rent</span>
              </label>
              <label className="flex items-center p-3 border border-zinc-300 rounded-xl bg-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  value="swap"
                  {...register("listingType", {
                    required: "Listing type is required",
                  })}
                  className="form-radio text-blue-600 w-4 h-4 mr-3"
                />
                <span className="text-gray-700 font-medium">For Swap</span>
              </label>
            </div>
            <ErrorMessage field={errors.listingType} />
          </div>

          {/* Improved Pets and Furnished Section */}
          <div className="md:col-span-2">
            <label className={`${labelTextStyles} block mb-3`}>Property Features</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center p-4 border border-zinc-300 rounded-xl bg-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register("petsAllowed")}
                  className="form-checkbox text-blue-600 w-5 h-5 mr-3"
                />
                <div>
                  <span className="text-gray-700 font-medium block">Pets Allowed</span>
                  <span className="text-gray-500 text-sm">Pet-friendly property</span>
                </div>
              </label>
              <label className="flex items-center p-4 border border-zinc-300 rounded-xl bg-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register("furnished")}
                  className="form-checkbox text-blue-600 w-5 h-5 mr-3"
                />
                <div>
                  <span className="text-gray-700 font-medium block">Furnished</span>
                  <span className="text-gray-500 text-sm">Fully furnished property</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div>
          <Suspense
            fallback={
              <DelayedFallback>
                <Spinner />
              </DelayedFallback>
            }>
            {listingType === "rent" ? (
              <RentalTerms />
            ) : listingType === "sale" ? (
              <SaleTerms />
            ) : listingType === "swap" ? (
              <SwapTerms />
            ) : null}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default PropertySection;
