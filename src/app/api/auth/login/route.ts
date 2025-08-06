// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifyPassword } from '@/lib/auth/password';
import { setSession } from '@/lib/auth/jwt';
import { eq } from 'drizzle-orm';
import { verifyRecaptcha } from '@/lib/auth/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await request.json();

    if (!email || !password || !recaptchaToken) {
      return NextResponse.json(
        { error: 'Email, password, and reCAPTCHA are required' },
        { status: 400 }
      );
    }

    const recaptchaRes = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaRes.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 403 }
      );
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user[0].password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await db
      .update(users)
      .set({ lastSignIn: new Date() })
      .where(eq(users.id, user[0].id));

    await setSession(user[0].id, user[0].email);

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user[0].id, email: user[0].email, name: user[0].name }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}