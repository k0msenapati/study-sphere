'use client';

import Login from '@/components/auth/Login';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full "
      >
        <Login />
      </motion.div>
    </div>
  );
}
