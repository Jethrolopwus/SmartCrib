"use client";

import React from "react";

import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ListingData } from "@/app/listingform/page";

const SwapTerms = () => {
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
  const labelTextStyles = `lg:text-xl text-lg font-extralight text-stone-700`;
  return (
    <>
      {/* Swap Terms */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="  w-4/5 flex flex-col mx-auto items-start">
        <h2 className="lg:text-3xl text-xl font-semibold text-stone-700 w-4/5 mx-auto">
          Terms of Swap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 border border-zinc-400 p-3 lg:p-10 rounded-2xl">
          <div className="md:col-span-2">
            <label className={labelTextStyles} htmlFor="desiredLocation">
              Desired Location
            </label>
            <input
              type="text"
              className={inputClassStyles}
              id="desiredLocation"
              {...register("swapTerms.desiredLocation", {
                required: "The Desired location is required",
              })}
              placeholder="e.g., 123 Main Street"
            />
            <ErrorMessage field={errors?.swapTerms?.desiredLocation} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="minSize">
              Minimun Size
            </label>
            <input
              type="text"
              id="minSize"
              className={inputClassStyles}
              {...register("swapTerms.minSize", {
                required: "Field is required",
              })}
              placeholder="e.g., 2,500 sqft"
            />
            <ErrorMessage field={errors?.swapTerms?.minSize} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="maxSize">
              Maximum Size
            </label>
            <input
              type="text"
              id="maxSize"
              {...register("swapTerms.maxSize", {
                required: "Field is required",
              })}
              placeholder="e.g., 15 hec"
              className={inputClassStyles}
            />
            <ErrorMessage field={errors.swapTerms?.maxSize} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="swapDuration">
              Duration of Asset Swap
            </label>
            <input
              type="number"
              id="swapDuration"
              {...register("swapTerms.swapDuration", {
                required: "Duration of Swap is required",
              })}
              className={inputClassStyles}
              placeholder="e.g., 6 months"
            />
            <ErrorMessage field={errors?.swapTerms?.swapDuration} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="swapDate">
              Swap Date
            </label>
            <input
              type="text"
              id="swapDate"
              {...register("swapTerms.swapDate", {
                required: "Country is required",
              })}
              placeholder="e.g., 01/12/2025"
              className={inputClassStyles}
            />
            <ErrorMessage field={errors?.swapTerms?.swapDate} />
          </div>

          <div className="flex items-center gap-5 w-full">
            <label className={labelTextStyles} htmlFor="flexibleDates">
              Flexible Dates
            </label>
            <input
              type="checkbox"
              id="swapDate"
              {...register("swapTerms.swapDate", {
                required: "Flexible dates field is required",
              })}
            />
            <ErrorMessage field={errors?.swapTerms?.flexibleDates} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SwapTerms;
