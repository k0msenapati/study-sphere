"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, User } from "lucide-react"
import { motion } from "framer-motion"

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onUpload: (file: File) => Promise<void>
  loading?: boolean
}

export function AvatarUpload({ currentAvatar, userName, onUpload, loading = false }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Upload file
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>
            Upload a profile picture to personalize your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-muted">
              <AvatarImage 
                src={previewUrl || currentAvatar} 
                alt={userName}
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <Button
              onClick={handleButtonClick}
              disabled={uploading || loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || loading}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
