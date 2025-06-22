'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //Added this at last moment as the link in url is not changing to /dashboard
      if (response.ok) {
        window.location.href = '/dashboard';
      }
      else {
        setError(data.error || 'Login failed');
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
        action=""  onSubmit={handleSubmit} 
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
            <div>
                <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Study-Sphere</h1>
                <p className="text-sm">Welcome back! Sign in to continue</p>
            </div>

            <hr className="my-4 border-dashed" />
            {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="block text-sm">
                        Email
                    </Label>
                    <Input
                        type="email"
                        required
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                    />
                </div>

                <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="pwd"
                            className="text-title text-sm">
                            Password
                        </Label>
                        <Button
                            asChild
                            variant="link"
                            size="sm">
                            <Link
                                href="/auth/ForgotPassword"
                                className="link intent-info variant-ghost text-sm">
                                Forgot your Password ?
                            </Link>
                        </Button>
                    </div>
                    <Input
                        type="password"
                        required
                        name="pwd"
                        id="pwd"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="input sz-md variant-mixed"
                    />
                </div>

                <Button className="w-full"  type="submit" >  {loading ? 'Signing In...' : 'Sign In'} </Button>
            </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
                Don't have an account ?
                <Button
                    asChild
                    variant="link"
                    className="px-2">
                    <Link href="/auth/register">Create account</Link>
                </Button>
            </p>
        </div>
    </form>
</section>
  );
}
