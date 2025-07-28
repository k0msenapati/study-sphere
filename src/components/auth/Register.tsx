'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const checkPasswordStrength = useCallback((password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const lengthCheck = password.length >= 8;

  if (lengthCheck && hasUpperCase && hasLowerCase && hasNumbers && hasSpecial) {
    return 'Strong';
  } else if (lengthCheck && ((hasUpperCase && hasLowerCase) || hasNumbers)) {
    return 'Moderate';
  } else {
    return 'Weak';
  }
}, []);

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (password) {
        const strength = checkPasswordStrength(password);
        setPasswordStrength(strength);
      }
    }, 300); // 300ms debounce 

    return () => clearTimeout(timeout);
  }, [password, checkPasswordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error');
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
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Image
            src="/study-sphere-logo1.png"
            alt="Study Sphere Logo"
            width={64}
            height={64}
            className="h-16 w-16"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-gray-600">Join Study Sphere today</p>
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

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        {password && (
          <p
            className={`text-sm mt-1 ${
              passwordStrength === 'Strong'
                ? 'text-green-600'
                : passwordStrength === 'Moderate'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            Strength: {passwordStrength}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </motion.form>
  );
}
