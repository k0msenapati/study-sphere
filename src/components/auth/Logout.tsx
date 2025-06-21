'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react'; // Optional: Install lucide-react if not added

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
      className="flex items-center gap-2 text-sm sm:text-base px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 transition-all text-white font-medium shadow-md hover:shadow-lg"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
