"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  resetPassword,
  sendResetCode,
  verifyResetCode,
} from "@/actions/resetPasswordAction.action";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Lock, Mail, Key, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

type Step = "email" | "code" | "password";

const resetPasswordSchema = zod.object({
  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
});

type ResetPasswordFormData = zod.infer<typeof resetPasswordSchema>;

const passwordRequirements = [
  { label: "At least 8 characters", regex: /^.{8,}$/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /\d/ },
  { label: "One special character", regex: /[^A-Za-z0-9]/ },
];

export default function ResetPasswordModern() {
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const {
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score === 0) return { text: "Very Weak", color: "bg-destructive" };
    if (score <= 2) return { text: "Weak", color: "bg-orange-500" };
    if (score <= 4) return { text: "Medium", color: "bg-yellow-500" };
    return { text: "Strong", color: "bg-success" };
  };

  const strength = checkPasswordStrength(password);

  async function handleEmail() {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await sendResetCode(email);
      setStep("code");
      setSuccess("Verification code sent to your email");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to send code");
    }

    setLoading(false);
  }

  async function handleCode() {
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyResetCode(code);
      setStep("password");
      setSuccess("Code verified successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Invalid verification code");
    }

    setLoading(false);
  }

  async function handleReset() {
    if (!password) {
      setError("Please enter a new password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword(email, password);
      setSuccess("Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-accent p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="opacity-90">
              {step === "email" 
                ? "Enter your email to get started"
                : step === "code"
                ? "Enter verification code"
                : "Create new password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between">
              {["Email", "Code", "Password"].map((label, index) => {
                const stepNumber = index + 1;
                const currentStep = step === "email" ? 1 : step === "code" ? 2 : 3;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                  <div key={label} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isCompleted 
                        ? "bg-success text-success-foreground" 
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {isCompleted ? "✓" : stepNumber}
                    </div>
                    <span className={`text-xs mt-2 ${
                      isCompleted || isCurrent ? "font-medium" : "text-muted-foreground"
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Step 1: Email */}
            {step === "email" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 pl-10 bg-background border border-border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <button
                  onClick={handleEmail}
                  disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-primary to-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: Code */}
            {step === "code" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setCode(value);
                        setError("");
                      }}
                      placeholder="6-digit code"
                      className="w-full px-4 py-3 pl-10 text-center tracking-widest bg-background border border-border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the 6-digit code sent to {email}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStep("email");
                      setError("");
                    }}
                    className="flex-1 px-4 py-3 border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-accent/10 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCode}
                    disabled={loading || code.length !== 6}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-primary to-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Password */}
            {step === "password" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 pl-10 pr-10 bg-background border border-border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Password strength:</span>
                        <span className="text-sm font-medium">{strength.text}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(password.length / 20) * 100}%` }}
                          className={`h-full ${strength.color} transition-colors`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.regex.test(password);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          {isValid ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                          )}
                          <span className={`text-sm ${isValid ? "text-success" : "text-muted-foreground"}`}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStep("code");
                      setError("");
                    }}
                    className="flex-1 px-4 py-3 border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-accent/10 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-success text-success-foreground rounded-lg font-semibold hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-success-foreground border-t-transparent rounded-full animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-primary font-medium hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}