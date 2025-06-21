import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth/jwt';

export async function POST() {
  clearSession();
  return NextResponse.json({ message: 'Logged out successfully' });
}