"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import toast from "react-hot-toast";
import { addAddressAction } from "@/actions/addressAction.action";
import {
  egyptianCities,
  egyptianGovernorates,
  isValidEgyptianCity,
} from "@/helpers/Egyptianlocations";
import { MapPin, Phone, FileText, Loader2, ArrowLeft } from "lucide-react";

const addressSchema = zod.object({
  phone: zod
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(010|011|012|015)\d{8}$/,
      "Please enter a valid Egyptian phone number (e.g., 01012345678)"
    ),
  details: zod
    .string()
    .min(10, "Address details must be at least 10 characters")
    .max(200, "Address details must not exceed 200 characters"),
  city: zod
    .string()
    .min(1, "City is required")
    .refine(
      (city) => isValidEgyptianCity(city),
      "Please enter a valid Egyptian city"
    ),
});

type AddressFormData = zod.infer<typeof addressSchema>;

export default function AddAddress() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  async function onSubmit(data: AddressFormData) {
    try {
      setIsLoading(true);

      const response = await addAddressAction(data.details, data.phone, data.city);

      if (response.status === "error") {
        toast.error(response.message || "Failed to add address");
        return;
      }

      if (response.status === "success") {
        toast.success("Address added successfully!");

        setTimeout(() => {
          router.push("/profile-page");
        }, 500);
      }
    } catch (error: any) {
      console.error("Add address error:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Add New Address
        </h1>
        <p className="text-muted-foreground">
          Add a shipping address for your orders
        </p>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="01012345678"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.phone && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.phone.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Egyptian mobile numbers only (010, 011, 012, 015)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              City <span className="text-destructive">*</span>
            </label>
            <select
              {...register("city")}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select City</option>
              {egyptianGovernorates.flatMap((gov) =>
                egyptianCities[gov]?.map((city) => (
                  <option key={`${gov}-${city}`} value={city}>
                    {city} ({gov})
                  </option>
                ))
              )}
            </select>
            {errors.city && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Address Details <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("details")}
              placeholder="Street name, building number, floor, apartment number, landmarks..."
              rows={4}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.details && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.details.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Provide detailed information (10-200 characters)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Address"
              )}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border-2 border-border rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20">
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Address Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Only Egyptian addresses are accepted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Use a valid Egyptian mobile number</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Provide detailed information for accurate delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Include landmarks to help delivery personnel</span>
          </li>
        </ul>
      </div>
    </div>
  );
}