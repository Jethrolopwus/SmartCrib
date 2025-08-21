"use client";

import React from "react";

import { useForm, useFormContext } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";

const LocationSection = () => {
  const [mounted, setMounted] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<ListingData>();

  const onSubmit = (data: ListingData) => {
    console.log(data); // Log the single selected country
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ErrorMessage = ({ field }: { field?: { message?: string } }) =>
    field ? <p className="text-red-500 text-xs mt-1">{field.message}</p> : null;

  const inputClassStyles = `p-4 focus:outline border border-zinc-300 text-stone-500 w-full rounded-2xl outline-none bg-zinc-200`;
  const labelTextStyles = `text-xl font-light text-stone-700`;
  return (
    <>
      {/* Location Section */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-t-2xl bg-white/90 py-2 lg:p-5 w-full lg:w-3/4 flex flex-col mx-auto items-start">
        <h2 className="text-3xl font-light w-4/5 mx-auto">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 border border-zinc-400 p-2 lg:p-10 rounded-2xl">
          <div className="md:col-span-2">
            <label className={labelTextStyles} htmlFor="address">
              Address Line 1
            </label>
            <input
              type="text"
              className={inputClassStyles}
              id="address"
              {...register("address", {
                required: "Address is required",
              })}
              placeholder="e.g., 123 Main Street"
            />
            <ErrorMessage field={errors.address} />
          </div>
          <div>
            <label className={labelTextStyles} htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              className={inputClassStyles}
              {...register("city", { required: "City is required" })}
              placeholder="e.g., New York"
            />
            <ErrorMessage field={errors.city} />
          </div>
          <div>
            <label className={labelTextStyles} htmlFor="stateProvince">
              State / Province
            </label>
            <input
              type="text"
              id="stateProvince"
              {...register("stateProvince", {
                required: "State/Province is required",
              })}
              placeholder="e.g., NY"
              className={inputClassStyles}
            />
            <ErrorMessage field={errors.stateProvince} />
          </div>
          <div>
            <label className={labelTextStyles} htmlFor="zipPostalCode">
              Zip / Postal Code
            </label>
            <input
              type="text"
              id="zipPostalCode"
              {...register("zipPostalCode", {
                required: "Zip/Postal Code is required",
              })}
              className={inputClassStyles}
              placeholder="e.g., 10001"
            />
            <ErrorMessage field={errors.zipPostalCode} />
          </div>
          <div>
            <label className={labelTextStyles} htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              {...register("country", {
                required: "Country is required",
              })}
              placeholder="e.g., USA"
              className={inputClassStyles}
            />
            <ErrorMessage field={errors.country} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSection;
