'use client';

import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition text-white"
    >
      Logout
    </button>
  );
}
