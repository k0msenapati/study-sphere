"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { UserSettings, NewUserSettings } from '@/lib/tasks/types'
import { Settings, Clock, Zap, Save } from 'lucide-react'

export function ProductivitySettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<NewUserSettings>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user-settings')
      if (response.ok) {
        const userSettings = await response.json()
        setSettings(userSettings)
        setFormData(userSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        // You could show a success message here
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof NewUserSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            Loading settings...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Work Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workStart">Work Start Time</Label>
              <Input
                id="workStart"
                type="time"
                value={formData.workStartTime || '09:00'}
                onChange={(e) => handleInputChange('workStartTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workEnd">Work End Time</Label>
              <Input
                id="workEnd"
                type="time"
                value={formData.workEndTime || '17:00'}
                onChange={(e) => handleInputChange('workEndTime', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peakStart">Peak Hours Start</Label>
              <Input
                id="peakStart"
                type="time"
                value={formData.peakHoursStart || '10:00'}
                onChange={(e) => handleInputChange('peakHoursStart', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="peakEnd">Peak Hours End</Label>
              <Input
                id="peakEnd"
                type="time"
                value={formData.peakHoursEnd || '12:00'}
                onChange={(e) => handleInputChange('peakHoursEnd', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Focus Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="focusSession">Focus Session (minutes)</Label>
              <Input
                id="focusSession"
                type="number"
                min="15"
                max="180"
                value={formData.focusSessionDuration || 90}
                onChange={(e) => handleInputChange('focusSessionDuration', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="5"
                max="60"
                value={formData.breakDuration || 20}
                onChange={(e) => handleInputChange('breakDuration', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pomodoro Technique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pomodoroEnabled">Enable Pomodoro Timer</Label>
            <Switch
              id="pomodoroEnabled"
              checked={formData.pomodoroEnabled || false}
              onCheckedChange={(checked: boolean) => handleInputChange('pomodoroEnabled', checked)}
            />
          </div>
          
          {formData.pomodoroEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pomodoroWork">Work Duration (minutes)</Label>
                <Input
                  id="pomodoroWork"
                  type="number"
                  min="15"
                  max="60"
                  value={formData.pomodoroWorkDuration || 25}
                  onChange={(e) => handleInputChange('pomodoroWorkDuration', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="pomodoroBreak">Break Duration (minutes)</Label>
                <Input
                  id="pomodoroBreak"
                  type="number"
                  min="5"
                  max="30"
                  value={formData.pomodoroBreakDuration || 5}
                  onChange={(e) => handleInputChange('pomodoroBreakDuration', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
