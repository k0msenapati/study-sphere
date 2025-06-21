import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
     return NextResponse.json({
      email: session.email,
      userId: session.userId
    })
  } catch (error) {
    console.error('Session api error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}