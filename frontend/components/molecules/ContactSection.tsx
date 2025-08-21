"use client";

import React from "react";

import { useForm, useFormContext } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";

const ContactSection = () => {
  const [mounted, setMounted] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<ListingData>();

  const onSubmit = (data: ListingData) => {
    console.log(data);
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
      {/* Contact Information */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-t-2xl bg-white/90 w-full lg:w-3/4 flex flex-col mx-auto items-start py-5">
        <h2 className="text-3xl font-normal text-stone-700 w-4/5 mx-auto">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-4/5 mx-auto my-5 rounded-2xl p-2 border border-zinc-400 lg:p-10">
          <div>
            <label htmlFor="contactName" className={labelTextStyles}>
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              className={inputClassStyles}
              {...register("contactName", {
                required: "Contact name is required",
              })}
              placeholder="e.g., John Doe"
            />
            <ErrorMessage field={errors.contactName} />
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelTextStyles}>
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              className={inputClassStyles}
              {...register("contactEmail", {
                required: "Contact email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="e.g., john.doe@example.com"
            />
            <ErrorMessage field={errors.contactEmail} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="contactPhone" className={labelTextStyles}>
              Contact Phone
            </label>
            <input
              type="tel"
              className={inputClassStyles}
              id="contactPhone"
              {...register("contactPhone", {
                required: "Contact phone is required",
              })}
              placeholder="e.g., +123 456 7890"
            />
            <ErrorMessage field={errors.contactPhone} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
