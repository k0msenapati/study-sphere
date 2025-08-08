'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

  useEffect(() => {
    if (!siteKey) {
      console.error('⚠️ Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY. reCAPTCHA will not work.');
    }
  }, [siteKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login failed');
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      setError('Network error');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 shadow-xl rounded-2xl space-y-6"
    >
      {/* Logo */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Image src="/study-sphere-logo1.png" alt="Study Sphere Logo" width={64} height={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600">Sign in to Study Sphere</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* reCAPTCHA */}
      {siteKey && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={(token) => setRecaptchaToken(token || '')}
        />
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </motion.form>
  );
}