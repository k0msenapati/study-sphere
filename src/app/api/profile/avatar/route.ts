import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth/jwt"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

// POST /api/profile/avatar — Upload profile picture
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Update user's avatar URL in database
    const avatarUrl = `/uploads/avatars/${fileName}`
    
    await db
      .update(users)
      .set({
        avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId))

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
