"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendRegisterRequest } from "@/actions/registerAction.action";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { schema, RegisterFormData } from "@/Schema/registerSchema";
import { UserCircle, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, WifiOff, RefreshCw } from "lucide-react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  // ✅ Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", { duration: 3000 });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function onSubmit(data: RegisterFormData) {
    // ✅ تحقق من الاتصال
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    setIsLoading(true);
    setShowRetry(false);
    
    // ✅ Timeout بعد 20 ثانية (Registration قد يأخذ وقت أطول)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Request is taking too long. Please try again.", {
        duration: 6000
      });
      setShowRetry(true);
    }, 20000);

    try {
      const response = await sendRegisterRequest(data);
      
      clearTimeout(timeout);

      if (response.message === "success" || response.token) {
        toast.success("Account created successfully!", {
          duration: 3000,
          icon: '✅'
        });

        // ✅ Auto sign-in
        const signInResponse = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResponse?.ok) {
          toast.success("Logged in successfully!", {
            duration: 2000
          });
          router.push("/products");
          router.refresh();
        } else {
          // Failed to auto-login, redirect to login page
          router.push("/login");
        }
      } else {
        throw new Error(response.message || "Registration failed");
      }
      
    } catch (error: any) {
      clearTimeout(timeout);
      console.error("Registration error:", error);
      
      // ✅ تصنيف الأخطاء
      const errorMessage = error.message || error.toString();
      
      if (!navigator.onLine) {
        toast.error("Connection lost. Please check your internet.", {
          duration: 8000,
          icon: '📡'
        });
        setShowRetry(true);
        
      } else if (errorMessage.includes('Email already registered') || 
                 errorMessage.includes('already exists') ||
                 errorMessage.includes('duplicate')) {
        toast.error("This email is already registered. Please sign in instead.", {
          duration: 6000,
          icon: '📧'
        });
        
      } else if (errorMessage.includes('timeout')) {
        toast.error("Request timeout. Please try again.", {
          duration: 6000
        });
        setShowRetry(true);
        
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error("Network error. Please check your connection.", {
          duration: 8000,
          icon: '📡'
        });
        setShowRetry(true);
        
      } else {
        toast.error(errorMessage || "Registration failed. Please try again.", {
          duration: 5000
        });
        setShowRetry(true);
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* ✅ Offline Warning */}
        {!isOnline && (
          <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-warning">
              <WifiOff className="w-5 h-5" />
              <p className="text-sm font-medium">
                You are currently offline. Please check your connection.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join ShopMart and start shopping today
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-primary" />
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter your full name"
                disabled={isLoading || !isOnline}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                disabled={isLoading || !isOnline}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="01012345678"
                disabled={isLoading || !isOnline}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Egyptian mobile numbers only (010, 011, 012, 015)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  disabled={isLoading || !isOnline}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading || !isOnline}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("rePassword")}
                  placeholder="Confirm your password"
                  disabled={isLoading || !isOnline}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading || !isOnline}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.rePassword && (
                <p className="text-sm text-destructive">{errors.rePassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isOnline}
              className="w-full h-12 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {!isOnline ? (
                <span className="flex items-center justify-center gap-2">
                  <WifiOff className="w-5 h-5" />
                  Offline
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : showRetry ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Retry
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link href="/login" className="block">
            <button
              type="button"
              disabled={!isOnline}
              className="w-full h-12 border-2 border-border rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-[1.02] group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
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

        {/* Terms */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-primary hover:text-accent transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:text-accent transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}