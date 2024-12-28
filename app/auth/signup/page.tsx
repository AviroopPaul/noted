"use client";

import SignUpForm from "@/components/Auth/SignUpForm";
import { useTheme } from "@/app/ThemeContext";
import Link from "next/link";

export default function SignUp() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-200"
      data-theme={theme}
    >
      <Link href="/" className="text-4xl font-bold text-center mb-6 font-mono text-primary hover:opacity-80 transition-opacity">
        Noted.
      </Link>
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <SignUpForm />
          <div className="divider"></div>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="link link-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
