import { LoginForm } from "@/components/LoginForm/LoginForm";
import React from "react";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        
      <div className="min-w-md bg-white dark:bg-gray-800 py-10 px-6 rounded-2xl shadow-2xl">

        <h2 className="mb-4 text-2xl dark:text-white">LoginPage</h2>

        <LoginForm />

      </div>
    </div>
  );
}
