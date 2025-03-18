'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";

const Login: React.FC = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState<string | null>(null); // Added state for lock time
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }

    if (!Email || !Password || !Department) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password, Department, recaptchaToken: captchaValue, }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.Department && result.Department !== Department) {
          toast.error("Department mismatch! Please check your selection.");
          setLoading(false);
          return;
        }

        toast.success("Login successful!");
        setTimeout(() => {
          if (result.Department === "CSR") {
            router.push(`/ModuleCSR/CSR/Dashboard?id=${encodeURIComponent(result.userId)}`);
          } else if (result.Department === "Sales") {
            router.push(`/ModuleSales/Sales/Dashboard?id=${encodeURIComponent(result.userId)}`);
          } else {
            toast.error("Invalid department selection");
          }
        }, 1500);
      } else {
        if (result.lockUntil) {
          const lockTime = new Date(result.lockUntil);
          setLockUntil(lockTime.toLocaleString());
          toast.error(`Account locked! Try again after ${lockTime.toLocaleString()}.`);

        } else {
          toast.error(result.message || "Login failed!");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: "url('/building.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 shadow-lg"></div>
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white backdrop-blur-lg rounded-lg shadow-xl text-center">
        <Image src="/ecoshift.png" alt="JJ Venture Logo" width={200} height={100} className="mx-auto mb-4 drop-shadow-[2px_2px_3px_white]" />
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-medium text-dark mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-dark mb-1">Password</label>
            <input
              type="password"
              placeholder="6+ Characters, 1 Capital letter"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-dark mb-1">Department</label>
            <select
              value={Department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <option value="">Select Department</option>
              <option value="CSR">CSR</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Display lock time if account is locked */}
          {lockUntil && (
            <div className="mb-4 text-red-600 text-xs font-bold">
              Account locked! Try again after: {lockUntil}
            </div>
          )}

          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6Ld7uPcqAAAAAGg0XRahPebOA9nXeJh9ymt-hj7m" // Palitan ng actual site key mo
              onChange={(value) => setCaptchaValue(value)}
            />
            <button
              type="submit"
              className="w-full text-xs py-3 bg-green-800 text-white font-medium rounded-md hover:bg-green-600 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <footer className="mt-4 text-xs text-dark font-bold">
          <p>Enterprise Resource Planning - Developed By IT Department</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
