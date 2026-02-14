"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowRight, WifiOff, RefreshCw } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("url");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [showRetry, setShowRetry] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const router = useRouter();

  // ✅ Online/Offline Detection
  React.useEffect(() => {
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
  
  async function onSubmit(data: z.infer<typeof formSchema>) {
    // ✅ تحقق من الاتصال أولاً
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    setIsLoading(true);
    setShowRetry(false);
    
    // ✅ Timeout بعد 15 ثانية
    const timeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Request is taking too long. Please try again.", {
        duration: 6000
      });
      setShowRetry(true);
    }, 15000);

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: redirectUrl || "/products",
        redirect: false,
      });
      
      clearTimeout(timeout);

      if (response?.error) {
        // ✅ تمييز أنواع الأخطاء
        if (response.error.includes('CredentialsSignin') || 
            response.error.includes('credentials')) {
          toast.error("Invalid email or password. Please try again.", {
            duration: 5000,
            icon: '🔐'
          });
        } else if (response.error.includes('fetch') || 
                   response.error.includes('network')) {
          toast.error("Connection lost. Please check your internet.", {
            duration: 8000,
            icon: '📡'
          });
          setShowRetry(true);
        } else {
          toast.error("Login failed. Please try again.", {
            duration: 5000
          });
          setShowRetry(true);
        }
      } else if (response?.ok) {
        toast.success("Login successful! Redirecting...", {
          duration: 2000,
          icon: '✅'
        });
        router.push(redirectUrl || "/products");
        router.refresh();
      }
      
    } catch (error: any) {
      clearTimeout(timeout);
      console.error("Login error:", error);
      
      // ✅ معالجة أنواع الأخطاء
      if (!navigator.onLine || error.message?.includes('fetch')) {
        toast.error("Connection lost. Please check your internet.", {
          duration: 8000,
          icon: '📡'
        });
        setShowRetry(true);
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          duration: 5000
        });
        setShowRetry(true);
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
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

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <div className="glass rounded-2xl p-8 space-y-6 hover:shadow-glow transition-all duration-300">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading || !isOnline}
                  className={`h-12 ${
                    fieldState.invalid ? "border-destructive" : ""
                  }`}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </label>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading || !isOnline}
                  className={`h-12 ${
                    fieldState.invalid ? "border-destructive" : ""
                  }`}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end">
            <Link
              href="/reset-password-page"
              className="text-sm text-primary hover:text-accent transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading || !isOnline}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              {!isOnline ? (
                <span className="flex items-center justify-center gap-2">
                  <WifiOff className="w-5 h-5" />
                  Offline
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : showRetry ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Retry
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </Button>

            <Link href="/reset-password-page" className="block">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading || !isOnline}
                className="w-full h-12 font-semibold text-base hover:bg-secondary transition-all duration-300"
              >
                Reset Password
              </Button>
            </Link>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">
              New to ShopMart?
            </span>
          </div>
        </div>

        <Link href="/register" className="block">
          <Button
            type="button"
            variant="outline"
            disabled={!isOnline}
            className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-base transition-all duration-300 group"
          >
            <span className="flex items-center justify-center gap-2">
              Create an Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-primary hover:text-accent transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-primary hover:text-accent transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}