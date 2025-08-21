"use client";

import { useForm, useFormContext } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";

import React from "react";

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

const AmenitiesSection = () => {
  const [mounted, setMounted] = useState(false);
  const {
    register,
    formState: { defaultValues, errors },
    control,
    handleSubmit,
    getValues,
    setValue,
  } = useFormContext<ListingData>();

  // Function to handle checkbox changes for amenities with setValue
  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    const currentAmenities = getValues("amenities"); // Get current amenities from form state
    setValue(
      "amenities",
      {
        ...currentAmenities,
        [name as keyof AmenityTypes]: checked,
      },
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: ListingData) => {
    console.log(data); // Log the single selected country
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const labelTextStyles = `text-xl font-light text-stone-700`;

  if (!mounted) return null;

  return (
    <>
      <div className="px-4 py-6 bg-white/90 rounded-t-2xl w-full lg:w-3/4 mx-auto">
        <h2 className="text-3xl font-light text-center mb-6">Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Map through amenities like this */}
          {Object.keys(defaultValues!.amenities ?? {}).map((key) => (
            <label key={key} className="flex items-center space-x-2 text-lg">
              <input
                type="checkbox"
                name={key}
                checked={
                  (getValues("amenities")[
                    key as keyof AmenityTypes
                  ] as boolean) || false
                }
                onChange={handleAmenityChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="capitalize text-gray-700">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default AmenitiesSection;
