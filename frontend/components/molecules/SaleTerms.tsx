"use client";

import React from "react";

import { useFormContext } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";

const SaleTerms = () => {
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
      {/* Sale Terms */}

      <div
        onSubmit={handleSubmit(onSubmit)}
        className="rounded w-4/5 flex flex-col mx-auto items-start lg:p-5">
        <h2 className="lg:text-3xl text-xl font-semibold text-stone-700 w-4/5 mx-auto">
          Terms of Sales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 rounded-2xl border border-zinc-400 p-2 lg:p-10">
          <div className="md:col-span-2">
            <label htmlFor="closingDate" className={labelTextStyles}>
              Closing date
            </label>
            <input
              type="text"
              className={inputClassStyles}
              id="closingDate"
              {...register("saleTerms.closingDate", {
                required: "Field is required",
              })}
            />
            <ErrorMessage field={errors.saleTerms?.closingDate} />
          </div>
          <div className="flex items-center gap-5 w-full">
            <label
              className={`${labelTextStyles} text-nowrap`}
              htmlFor="inspectionRequired">
              Inspection Required ?
            </label>
            <input
              type="checkbox"
              {...register("saleTerms.inspectionRequired", {
                required: "Field is required!",
              })}
              id="inspectionRequired"
            />
            <ErrorMessage field={errors.saleTerms?.inspectionRequired} />
          </div>

          <div className="flex items-center w-full gap-5 ">
            <label
              htmlFor="financingAvailable"
              className={`${labelTextStyles} text-nowrap`}>
              Financing Available ?
            </label>
            <input
              type="checkbox"
              id="financingAvailable"
              {...register("saleTerms.financingAvailable", {
                required: {
                  value: true,
                  message: "Please tick this field!",
                },
              })}
            />
            <ErrorMessage field={errors?.saleTerms?.financingAvailable} />
          </div>

          <div>
            <label htmlFor="downPayment" className={labelTextStyles}>
              Down Payment
            </label>
            <input
              type="number"
              id="downPayment"
              className={inputClassStyles}
              {...register("saleTerms.downpayment", {
                required: "Down payment is required",
              })}
              placeholder="e.g., $5,000"
            />
            <ErrorMessage field={errors?.saleTerms?.downpayment} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleTerms;
