'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password || !Department) return toast.error('All fields are required!');

    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, Password, Department }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.Department !== Department) {
          toast.error('Department mismatch!');
          setLoading(false);
          return;
        }
        toast.success('Login successful!');
        setTimeout(() => {
          router.push(`/Module${result.Department}/${result.Department}/Dashboard?id=${encodeURIComponent(result.userId)}`);
        }, 1000);
      } else {
        if (result.lockUntil) {
          setLockUntil(new Date(result.lockUntil).toLocaleString());
          toast.error(`Account locked! Try again after ${new Date(result.lockUntil).toLocaleString()}.`);
        } else {
          toast.error(result.message || 'Login failed!');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred while logging in!');
    } finally {
      setLoading(false);
    }
  }, [Email, Password, Department, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 relative p-4">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/building.jpg')" }}></div>
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white backdrop-blur-lg rounded-lg shadow-lg">
        <Image src="/ecoshift.png" alt="Ecoshift Corporation" width={200} height={100} priority={false} loading="lazy" className="mx-auto mb-4" />
        {lockUntil && <p className="text-red-600 text-xs font-bold text-center mb-4">Account locked! Try again after: {lockUntil}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm text-xs focus:ring-green-700" />
          <input type="password" placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm text-xs focus:ring-green-700" />
          <select value={Department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded-md shadow-sm text-xs focus:ring-green-700">
            <option value="">Select Department</option>
            <option value="CSR">CSR</option>
            <option value="Sales">Sales</option>
            <option value="BD">Business Development</option>
          </select>
          <button type="submit" className="w-full py-3 bg-green-800 text-white text-xs font-medium rounded-md hover:bg-green-600 shadow-md" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center font-bold">Enterprise Resource Planning - Developed By IT Department</p>
      </div>
    </div>
  );
};

export default Login;