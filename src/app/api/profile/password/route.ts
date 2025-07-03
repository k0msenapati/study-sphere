import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth/jwt"
import { hashPassword, verifyPassword } from "@/lib/auth/password"

// PUT /api/profile/password — Change user password
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json()

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: "New password must be different from current password" }, { status: 400 })
    }

    // Get current user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user[0].password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password in database
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId))

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error('Failed to update password:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
