"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import toast from "react-hot-toast";
import { User } from "@/interfaces/userOrdersInterface";
import { updateLoggedUserAction } from "@/actions/userAction.action";
import {
  UserCircle,
  Mail,
  Phone,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { WifiOff, RefreshCw } from "lucide-react";

const updateUserSchema = zod.object({
  name: zod
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: zod.string().email("Please enter a valid email address"),
  phone: zod
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(010|011|012|015)\d{8}$/,
      "Please enter a valid Egyptian phone number (e.g., 01012345678)",
    ),
});

type UpdateUserFormData = zod.infer<typeof updateUserSchema>;

interface EditProfileProps {
  user: User;
}

export default function EditProfile({ user }: EditProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const [optimisticData, setOptimisticData] = useState(user);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    },
  });

  async function onSubmit(data: UpdateUserFormData) {
    if (!isOnline) {
      toast.error("You are offline");
      return;
    }

    setIsLoading(true);
    setShowRetry(false);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Request taking too long");
      setShowRetry(true);
    }, 15000);

    // Save original
    const originalData = optimisticData;

    // Optimistic update
    setOptimisticData({
      ...optimisticData,
      name: data.name,
      email: data.email,
      phone: data.phone,
    });

    setIsLoading(true);
    try {
      setIsLoading(true);

      const response = await updateLoggedUserAction(
        data.name,
        data.email,
        data.phone,
      );

      clearTimeout(timeout);

      if (response.message !== "success") {
        setOptimisticData(originalData);
        toast.error(response.message || "Failed to update profile");
        setShowRetry(true);
        return;
      }

      toast.success("Profile updated successfully!");

      setTimeout(() => {
        router.push("/profile-page");
      }, 500);
    } catch (error: any) {
      setOptimisticData(originalData);
      toast.error("Network error");
      setShowRetry(true);
      console.error("Update profile error:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Edit Profile
        </h1>
        <p className="text-muted-foreground">Update your account information</p>
      </div>

      {/* Form Card */}
      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-primary" />
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your full name"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
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

          {/* Unsaved Changes Warning */}
          {isDirty && !isLoading && (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                You have unsaved changes
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !isDirty || !isOnline}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {!isOnline ? (
                <span className="flex items-center gap-2">
                  <WifiOff className="w-5 h-5" />
                  Offline
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </span>
              ) : showRetry ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Retry
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Save Changes
                </span>
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

      {/* Info Card */}
      <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20">
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Profile Information
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Your email address is used for login and notifications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Phone number is required for order delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Make sure your information is up to date</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
