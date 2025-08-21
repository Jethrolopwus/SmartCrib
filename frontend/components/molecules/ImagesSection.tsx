"use client";

import React from "react";

import { useForm, useFormContext, Controller } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { ListingData } from "@/app/listingform/page";

interface PreviewFile {
  name: string;
  url: string;
}

const ImagesSection = () => {
  const [mounted, setMounted] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    watch,
  } = useFormContext<ListingData>();

  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  const watchedImages = watch("images");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    // Update form field
    setValue("images", files);

    // Create previews
    if (files && files.length > 0) {
      const previewUrls: PreviewFile[] = [];
      let loadedCount = 0;

      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            previewUrls.push({
              name: file.name,
              url: e.target.result as string,
            });

            loadedCount++;

            // Update previews when all files are loaded
            if (loadedCount === files.length) {
              setPreviews(previewUrls);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviews([]);
    }
  };

  const onSubmit = (data: ListingData) => {
    if (data.images) {
      const filesArray = Array.from(data.images);
      console.log("Files:", filesArray);
    }
  };

  // Validation functions
  const validateMaxFiles = (value: FileList | null): string | boolean => {
    if (!value || value.length === 0) return true;
    return value.length <= 5 || "Maximum 5 images allowed";
  };

  const validateFileType = (value: FileList | null): string | boolean => {
    if (!value || value.length === 0) return true;

    const validTypes: string[] = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/svg+xml",
      "image/gif",
      "image/webp",
    ];

    for (let i = 0; i < value.length; i++) {
      if (!validTypes.includes(value[i].type)) {
        return "Only jpeg, png, jpg, svg, gif, webp image types are allowed.";
      }
    }
    return true;
  };

  const validateRequired = (value: FileList | null): string | boolean => {
    return (value && value.length > 0) || "At least one image is required";
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const ErrorMessage = ({ field }: { field?: { message?: string } }) =>
    field ? <p className="text-red-500 text-xs mt-1">{field.message}</p> : null;

  const inputClassStyles = `p-4 focus:outline border border-zinc-300 text-stone-500 w-full rounded-2xl outline-none bg-zinc-200`;
  const labelTextStyles = `lg:text-xl font-light text-stone-700 `;
  return (
    <>
      {/* Images Section */}
      <div
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-t-2xl bg-white/90 py-5 lg:p-5 w-full lg:w-3/4 flex flex-col mx-auto items-start">
        <h2 className="lg:text-3xl text-xl font-light w-4/5 mx-auto">
          Property Images
        </h2>

        <div className="w-4/5 mx-auto my-5 border border-zinc-400 p-3 lg:p-10 rounded-2xl">
          <label htmlFor="images" className={labelTextStyles}>
            Upload Images (Max 5)
          </label>

          <Controller
            name="images"
            control={control}
            rules={{
              validate: {
                required: validateRequired,
                maxFiveFiles: validateMaxFiles,
                fileType: validateFileType,
              },
            }}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                id="images"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/gif,image/webp"
                onChange={handleImageChange}
                className="w-full text-zinc-500 file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
              />
            )}
          />

          {/* Selected files display */}
          {watchedImages && watchedImages.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">
                Selected files ({watchedImages.length}/5):
              </p>
              <p className="mt-1 ">
                {Array.from(watchedImages)
                  .map((file: File) => file.name)
                  .join(", ")}
              </p>
            </div>
          )}

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((preview: PreviewFile, index: number) => (
                  <div
                    key={`${preview.name}-${index}`}
                    className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border shadow-sm 
                                group-hover:shadow-md transition-shadow"
                    />
                    <p
                      className="text-xs text-gray-500 mt-1 truncate flex flex-col gap-2"
                      title={preview.name}>
                      {preview.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {watchedImages && watchedImages[index]
                        ? (watchedImages[index].size / 1024 / 1024).toFixed(2) +
                          " MB"
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ErrorMessage field={errors.images} />
        </div>

        {/* Submit button */}
        <div className="w-4/5 mx-auto flex">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={!watchedImages || watchedImages.length === 0}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors font-medium">
            Upload Images ({watchedImages?.length || 0})
          </button>

          {/* Clear button */}
          {watchedImages && watchedImages.length > 0 && (
            <button
              onClick={() => {
                setValue("images", null);
                setPreviews([]);
                // Reset the file input
                const fileInput = document.getElementById(
                  "images"
                ) as HTMLInputElement;
                if (fileInput) fileInput.value = "";
              }}
              className="ml-3 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600
                         transition-colors font-medium">
              Clear All
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ImagesSection;
