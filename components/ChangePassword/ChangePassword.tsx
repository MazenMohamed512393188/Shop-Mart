"use client";
import { changePasswordAction } from "@/actions/changePasswordAction.action";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { WifiOff, RefreshCw } from "lucide-react";

const changePasswordSchema = zod
  .object({
    currentPassword: zod.string().min(1, "Current password is required"),
    password: zod
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
        "Password must contain at least one uppercase, lowercase, number and special character",
      ),
    rePassword: zod.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

type ChangePasswordFormData = zod.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&#]/.test(pwd)) strength++;

    if (strength <= 2)
      return { strength, label: "Weak", color: "text-destructive" };
    if (strength <= 3)
      return { strength, label: "Medium", color: "text-warning" };
    return { strength, label: "Strong", color: "text-success" };
  };

  const passwordStrength = getPasswordStrength(password || "");

  async function onSubmitPassword(data: ChangePasswordFormData) {
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

    try {
      const response = await changePasswordAction(
        data.currentPassword,
        data.password,
        data.rePassword,
      );

      clearTimeout(timeout);

      if (response?.error || response?.message === "error") {
        toast.error(response.error || "Failed to change password");
        setShowRetry(true);
        return;
      }

      if (response?.message === "success" || response?.token) {
        toast.success("Password changed successfully!");
        reset();

        // ✅ Auto logout after password change
        setTimeout(async () => {
          await signOut({ callbackUrl: "/login" });
        }, 2000);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      console.error("Error:", err);
      toast.error("Network error");
      setShowRetry(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Change Password
        </h1>
        <p className="text-muted-foreground">Update your account password</p>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Enter current password"
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter new password"
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}

            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span className={`font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.strength <= 2
                        ? "bg-destructive"
                        : passwordStrength.strength <= 3
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("rePassword")}
                placeholder="Confirm new password"
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.rePassword && (
              <p className="text-sm text-destructive">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !isOnline}
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {!isOnline ? (
                <span className="flex items-center gap-2">
                  <WifiOff className="w-5 h-5" />
                  Offline
                </span>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Changing...
                </span>
              ) : showRetry ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Retry
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Change Password
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

      <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20">
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Password Requirements
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>At least 6 characters long</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>One uppercase letter (A-Z)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>One lowercase letter (a-z)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>One number (0-9)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>One special character (@$!%*?&#)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
