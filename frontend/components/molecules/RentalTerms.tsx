"use client";

import React from "react";

import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ListingData } from "@/app/listingform/page";

const RentalTerms = () => {
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
      {/* Rental Terms */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="w-4/5 flex flex-col mx-auto items-start">
        <h2 className="lg:text-3xl text-xl font-semibold text-stone-700 w-4/5 mx-auto">Terms of Rent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 border border-zinc-400 p-2 lg:p-10 rounded-2xl">
          <div className="md:col-span-2">
            <label className={labelTextStyles} htmlFor="moveInDate">
              Movin In Date
            </label>
            <input
              type="text"
              className={inputClassStyles}
              id="moveInDate"
              {...register("rentalTerms.moveInDate", {
                required: "The Move In Date is required",
              })}
            />
            <ErrorMessage field={errors?.rentalTerms?.moveInDate} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="minDuration">
              Minimun Duration
            </label>
            <input
              type="number"
              id="minDuration"
              className={inputClassStyles}
              {...register("rentalTerms.minDuration", {
                required: "This Field is required",
              })}
            />
            <ErrorMessage field={errors?.swapTerms?.minSize} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="maxDuration">
              Maximum Duration
            </label>
            <input
              type="number"
              id="maxSize"
              {...register("rentalTerms.maxDuration", {
                required: "Field is required",
              })}
              className={inputClassStyles}
            />
            <ErrorMessage field={errors?.rentalTerms?.maxDuration} />
          </div>

          <div>
            <label className={labelTextStyles} htmlFor="securityDeposit">
              Security Deposit
            </label>
            <input
              type="number"
              id="securityDeposit"
              {...register("rentalTerms.securityDeposit", {
                required: "Security Depposit amount is required",
              })}
              className={inputClassStyles}
            />
            <ErrorMessage field={errors?.rentalTerms?.securityDeposit} />
          </div>

          <div className="flex items-center gap-5 w-full">
            <label className={labelTextStyles} htmlFor="utilitiesIncluded">
              Utilities Included ?
            </label>
            <input
              type="checkbox"
              id="utilitiesIncluded"
              {...register("rentalTerms.utilitiesIncluded", {
                required: "Inclusion of Utilities field is required",
              })}
            />
            <ErrorMessage field={errors?.rentalTerms?.utilitiesIncluded} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalTerms;
