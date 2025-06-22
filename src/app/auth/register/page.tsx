'use client';

import Register from '@/components/auth/Register';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-white to-purple-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full "
      >
        <Register />
      </motion.div>
    </div>
  );
}
