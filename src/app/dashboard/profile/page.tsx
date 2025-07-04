"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, BarChart3, Camera, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"

import { ProfileForm } from "@/components/profile/ProfileForm"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { PasswordChange } from "@/components/profile/PasswordChange"
import { AccountSettings } from "@/components/profile/AccountSettings"
import { StudyStats } from "@/components/profile/StudyStats"

interface ProfileData {
  id: number
  name: string
  email: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  lastSignIn?: Date
  createdAt: Date
  studyStreak: number
  totalNotes: number
  totalTasks: number
  completedTasks: number
  totalStudyTime: number
}

interface UserSettings {
  emailNotifications: boolean
  studyReminders: boolean
  weeklyProgress: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    studyReminders: true,
    weeklyProgress: false,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchProfile()
    fetchSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          ...data,
          createdAt: new Date(data.createdAt),
          lastSignIn: data.lastSignIn ? new Date(data.lastSignIn) : null,
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/profile/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleProfileUpdate = async (data: { name: string; displayName: string; bio: string }) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(prev => prev ? { ...prev, ...updatedProfile } : null)
        
        // Show success message
        alert('Profile updated successfully!')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { avatarUrl } = await response.json()
        setProfile(prev => prev ? { ...prev, avatarUrl } : null)
        alert('Avatar updated successfully!')
      } else {
        throw new Error('Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    }
  }

  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Password updated successfully!')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Failed to update password:', error)
      alert(error instanceof Error ? error.message : 'Failed to update password. Please try again.')
    }
  }

  const handleSettingsUpdate = async (newSettings: UserSettings) => {
    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        setSettings(newSettings)
        alert('Settings updated successfully!')
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('Failed to update settings. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
      })

      if (response.ok) {
        // Redirect to login page after account deletion
        window.location.href = '/auth/login'
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load profile. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account, preferences, and study progress.</p>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.displayName || profile.name}
                    </h2>
                    {profile.displayName && (
                      <p className="text-sm text-muted-foreground">({profile.name})</p>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {format(profile.createdAt, "MMMM yyyy")}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 max-w-md">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {profile.studyStreak} day streak
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {profile.totalNotes} notes
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {profile.completedTasks}/{profile.totalTasks} tasks
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Avatar</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StudyStats
              stats={{
                studyStreak: profile.studyStreak,
                joinDate: profile.createdAt,
                totalNotes: profile.totalNotes,
                totalTasks: profile.totalTasks,
                completedTasks: profile.completedTasks,
                totalStudyTime: profile.totalStudyTime,
                lastSignIn: profile.lastSignIn ?? null,
              }}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm
              profile={profile}
              onSave={handleProfileUpdate}
              loading={false}
            />
            <PasswordChange
              onChangePassword={handlePasswordChange}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="avatar">
            <AvatarUpload
              currentAvatar={profile.avatarUrl}
              userName={profile.name}
              onUpload={handleAvatarUpload}
              loading={false}
            />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings
              settings={settings}
              onUpdateSettings={handleSettingsUpdate}
              onDeleteAccount={handleDeleteAccount}
              loading={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
