'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const { data: session } = useSession(); // Get Google user info
  const router = useRouter();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Department, setDepartment] = useState('');
  const [ReferenceID, setReferenceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Autofill on successful Google Auth
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['First', 'Last'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Unknown';

      setEmail(session.user.email || '');
      setPassword('defaultGoogle'); // Optional: flag or default
      setReferenceID(`${firstName}${lastName}`.toLowerCase());
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Email || !Password || !Department) {
      toast.error('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, Password, Department, ReferenceID }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || 'Login failed!');
        return;
      }

      toast.success('Login successful!');
      router.push(`/Module${Department}/${Department}/Dashboard?id=${result.userId}`);
    } catch (err) {
      console.error(err);
      toast.error('Login error!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn('google'); // Triggers Google OAuth
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <ToastContainer />
      <h2>Login</h2>

      {lockUntil && <p style={{ color: 'red' }}>Account locked until: {lockUntil}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type={showPassword ? 'text' : 'password'}
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div>
          <label>Department:</label><br />
          <select value={Department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <button onClick={handleGoogleSignup} style={{ marginTop: '1rem' }}>
        Sign up with Google
      </button>
    </div>
  );
};

export default Login;
