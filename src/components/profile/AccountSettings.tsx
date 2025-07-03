"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Settings, Trash2, Bell, Shield, Save } from "lucide-react"
import { motion } from "framer-motion"

interface AccountSettingsProps {
  settings: {
    emailNotifications: boolean
    studyReminders: boolean
    weeklyProgress: boolean
  }
  onUpdateSettings: (settings: { emailNotifications: boolean; studyReminders: boolean; weeklyProgress: boolean }) => Promise<void>
  onDeleteAccount: () => Promise<void>
  loading?: boolean
}

export function AccountSettings({ settings, onUpdateSettings, onDeleteAccount, loading = false }: AccountSettingsProps) {
  const [formData, setFormData] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdateSettings(formData)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await onDeleteAccount()
    } finally {
      setDeleting(false)
    }
  }

  const handleSettingChange = (setting: keyof typeof formData, value: boolean) => {
    setFormData(prev => ({ ...prev, [setting]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="studyReminders">Study Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about your study sessions
              </p>
            </div>
            <Switch
              id="studyReminders"
              checked={formData.studyReminders}
              onCheckedChange={(checked) => handleSettingChange("studyReminders", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyProgress">Weekly Progress Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summaries of your progress
              </p>
            </div>
            <Switch
              id="weeklyProgress"
              checked={formData.weeklyProgress}
              onCheckedChange={(checked) => handleSettingChange("weeklyProgress", checked)}
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full md:w-auto"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and account security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Your Data is Secure</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Your study data is encrypted and stored securely</li>
              <li>• We never share your personal information with third parties</li>
              <li>• You can export or delete your data at any time</li>
              <li>• All passwords are hashed and cannot be viewed by anyone</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will permanently affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. This will permanently delete your profile, notes, tasks, and all associated data.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={loading || deleting}
                  className="w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                    <p className="font-medium">All of the following will be permanently deleted:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Your profile and account information</li>
                      <li>All your notes and study materials</li>
                      <li>Task lists and progress tracking</li>
                      <li>Chat history with the AI study buddy</li>
                      <li>Flashcards and quiz progress</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, delete my account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
