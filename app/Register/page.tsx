"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          Email: email,
          Password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => {
          router.push("/Login");
        }, 1500);
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred while registering!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
      <ToastContainer
        className="text-xs"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Slide}
      />

      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-6">
          <img src="/LinkerX.png" alt="Linker X" className="h-12 mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="6+ Characters, 1 Capital letter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full text-xs py-3 bg-violet-700 text-white font-medium rounded-md hover:bg-violet-800 transition-all shadow-md"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/Login" className="text-violet-700 font-semibold underline">
            Sign In
          </Link>
        </p>

        <footer className="mt-4 text-center text-[10px] text-gray-400">
          <p>Linker X - Developed by Leroux Y Xchire</p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
