'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit} // Connect form to handleSubmit
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <h1 className="text-title mb-1 mt-4 text-xl font-semibold">Create a Study-sphere Account</h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="Username" className="block text-sm">
                Username
              </Label>
              <Input
                type="text" // Changed from "Username" to "text"
                required
                name="Username"
                id="Username"
                value={name} // Connect to name state
                onChange={(e) => setName(e.target.value)} // Handle changes
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email} // Connect to state
                onChange={(e) => setEmail(e.target.value)} // Handle changes
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-title text-sm">
                Password
              </Label>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                value={password} // Connect to state
                onChange={(e) => setPassword(e.target.value)} // Handle changes
                className="input sz-md variant-mixed"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" // Make it a submit button
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Continue'}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}