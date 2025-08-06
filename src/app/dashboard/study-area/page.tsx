"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Timer, Zap, AlertTriangle, Expand, Shrink, Play, Pause, RotateCcw,
  Target, Brain, Coffee, BarChart3, Calendar, Clock, 
  Flame, Star, Trophy, CheckCircle, XCircle, Settings,
  Volume2, VolumeX, Music, Lightbulb, BookOpen, Upload
} from 'lucide-react'
import screenfull from 'screenfull'

interface FocusSession {
  id?: string
  startTime: Date
  endTime?: Date
  plannedDuration: number
  actualDuration?: number
  sessionType: 'focus' | 'break' | 'pomodoro'
  isCompleted: boolean
  notes?: string
  interruptions: number
  goalText?: string
  tags: string[]
  mood?: 'excellent' | 'good' | 'average' | 'poor'
  productivity?: number
}

interface SessionStats {
  totalSessions: number
  totalActualMinutes: number
  avgProductivity: number
  currentStreak: number
  longestStreak: number
  efficiency: number
}

const StudyAreaPage = () => {
  // Timer state
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionType, setSessionType] = useState<'focus' | 'break' | 'pomodoro'>('focus')
  
  // Session management
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([])
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null)
  
  // UI state
  const [showWarning, setShowWarning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSessionDialog, setShowSessionDialog] = useState(false)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  
  // Session customization
  const [goalText, setGoalText] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [interruptionCount, setInterruptionCount] = useState(0)
  
  // Audio and ambience
  const [isAmbientSoundEnabled, setIsAmbientSoundEnabled] = useState(false)
  const [selectedAmbientSound, setSelectedAmbientSound] = useState('none')
  const [ambientVolume, setAmbientVolume] = useState(50)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false)
  
  // Settings
  const [userSettings, setUserSettings] = useState({
    focusSessionDuration: 90,
    breakDuration: 20,
    pomodoroWorkDuration: 25,
    pomodoroBreakDuration: 5,
    pomodoroEnabled: false,
    studyAreaBackgroundImage: null as string | null,
    ambientSoundEnabled: false,
    selectedAmbientSound: 'none',
    ambientSoundVolume: 50
  })
  
  const studyAreaRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const ambientAudioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user settings and recent sessions
  useEffect(() => {
    fetchUserSettings()
    fetchRecentSessions()
    fetchSessionStats()
  }, [])

  // Ambient audio management
  useEffect(() => {
    if (ambientAudioRef.current) {
      if (isAmbientSoundEnabled && selectedAmbientSound !== 'none') {
        ambientAudioRef.current.src = `/audio/${selectedAmbientSound}.mp3`
        ambientAudioRef.current.volume = ambientVolume / 100
        ambientAudioRef.current.loop = true
        ambientAudioRef.current.play().catch(error => {
          console.log('Audio autoplay prevented:', error)
        })
      } else {
        ambientAudioRef.current.pause()
      }
    }
  }, [isAmbientSoundEnabled, selectedAmbientSound, ambientVolume])

  // Update ambient volume
  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = ambientVolume / 100
    }
  }, [ambientVolume])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          // Timer completed
          handleTimerComplete()
        }
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!)
    }

    return () => clearInterval(interval!)
  }, [isActive, isPaused, seconds, minutes])

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && !isPaused) {
        setShowWarning(true)
        handleInterruption()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive, isPaused])

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (screenfull.isEnabled) {
        setIsFullscreen(screenfull.isFullscreen)
      }
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange)
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange)
      }
    }
  }, [])

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user-settings')
      if (response.ok) {
        const settings = await response.json()
        const newSettings = {
          focusSessionDuration: settings.focusSessionDuration || 90,
          breakDuration: settings.breakDuration || 20,
          pomodoroWorkDuration: settings.pomodoroWorkDuration || 25,
          pomodoroBreakDuration: settings.pomodoroBreakDuration || 5,
          pomodoroEnabled: settings.pomodoroEnabled || false,
          studyAreaBackgroundImage: settings.studyAreaBackgroundImage || null,
          ambientSoundEnabled: settings.ambientSoundEnabled || false,
          selectedAmbientSound: settings.selectedAmbientSound || 'none',
          ambientSoundVolume: settings.ambientSoundVolume || 50
        }
        setUserSettings(newSettings)
        setBackgroundImage(newSettings.studyAreaBackgroundImage)
        setIsAmbientSoundEnabled(newSettings.ambientSoundEnabled)
        setSelectedAmbientSound(newSettings.selectedAmbientSound)
        setAmbientVolume(newSettings.ambientSoundVolume)
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
    }
  }

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/focus-sessions?limit=5')
      if (response.ok) {
        const sessions = await response.json()
        setRecentSessions(sessions)
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
    }
  }

  const fetchSessionStats = async () => {
    try {
      const response = await fetch('/api/focus-sessions/stats?period=week')
      if (response.ok) {
        const stats = await response.json()
        setSessionStats(stats)
      }
    } catch (error) {
      console.error('Error fetching session stats:', error)
    }
  }

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false)
    
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        endTime: new Date(),
        actualDuration: currentSession.plannedDuration,
        isCompleted: true,
        interruptions: interruptionCount,
        notes: sessionNotes,
        goalText,
        tags: selectedTags
      }
      
      await saveSession(completedSession)
      setShowSessionDialog(true)
    }

    // Play completion sound
    if (audioRef.current) {
      audioRef.current.play()
    }

    // Show celebration animation
    setShowSessionDialog(true)
  }, [currentSession, interruptionCount, sessionNotes, goalText, selectedTags])

  const handleInterruption = () => {
    setInterruptionCount(prev => prev + 1)
  }

  const saveSession = async (session: FocusSession) => {
    try {
      const response = await fetch('/api/focus-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: session.startTime,
          endTime: session.endTime,
          plannedDuration: session.plannedDuration,
          actualDuration: session.actualDuration,
          sessionType: session.sessionType,
          isCompleted: session.isCompleted,
          notes: session.notes,
          interruptions: session.interruptions,
          goalText: session.goalText,
          tags: session.tags,
          mood: session.mood,
          productivity: session.productivity
        })
      })

      if (response.ok) {
        fetchRecentSessions()
        fetchSessionStats()
      }
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const startSession = () => {
    let duration: number
    
    switch (sessionType) {
      case 'break':
        duration = userSettings.breakDuration
        break
      case 'pomodoro':
        duration = userSettings.pomodoroWorkDuration
        break
      default:
        duration = userSettings.focusSessionDuration
    }

    setMinutes(duration)
    setSeconds(0)
    setIsActive(true)
    setIsPaused(false)
    setInterruptionCount(0)
    
    const newSession: FocusSession = {
      startTime: new Date(),
      plannedDuration: duration,
      sessionType,
      isCompleted: false,
      interruptions: 0,
      goalText,
      tags: selectedTags
    }
    
    setCurrentSession(newSession)
  }

  const toggleTimer = () => {
    if (!isActive && !currentSession) {
      startSession()
    } else {
      setIsPaused(!isPaused)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB')
      return
    }

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload to a simple file endpoint or convert to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string
        setBackgroundImage(imageDataUrl)
        
        // Save to user settings
        await updateUserSettings({
          studyAreaBackgroundImage: imageDataUrl
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }
  }

  const removeBackgroundImage = async () => {
    setBackgroundImage(null)
    await updateUserSettings({
      studyAreaBackgroundImage: null
    })
  }

  const updateUserSettings = async (updates: Partial<typeof userSettings>) => {
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        setUserSettings(prev => ({ ...prev, ...updates }))
      }
    } catch (error) {
      console.error('Error updating user settings:', error)
    }
  }

  const toggleAmbientSound = async (enabled: boolean) => {
    setIsAmbientSoundEnabled(enabled)
    await updateUserSettings({
      ambientSoundEnabled: enabled
    })
  }

  const changeAmbientSound = async (sound: string) => {
    setSelectedAmbientSound(sound)
    await updateUserSettings({
      selectedAmbientSound: sound
    })
  }

  const changeAmbientVolume = async (volume: number) => {
    setAmbientVolume(volume)
    await updateUserSettings({
      ambientSoundVolume: volume
    })
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setCurrentSession(null)
    setMinutes(userSettings.focusSessionDuration)
    setSeconds(0)
    setInterruptionCount(0)
  }

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && studyAreaRef.current) {
      screenfull.toggle(studyAreaRef.current)
    }
  }

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!currentSession) return 0
    const totalSeconds = currentSession.plannedDuration * 60
    const remainingSeconds = minutes * 60 + seconds
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  }

  const predefinedTags = ['Study', 'Research', 'Reading', 'Writing', 'Math', 'Science', 'Programming', 'Review']
  const ambientSounds = [
    { value: 'none', label: 'No Sound', emoji: '🔇' },
    { value: 'rain', label: 'Rain', emoji: '🌧️' },
    { value: 'forest', label: 'Forest', emoji: '🌲' },
    { value: 'cafe', label: 'Coffee Shop', emoji: '☕' },
    { value: 'white-noise', label: 'White Noise', emoji: '📻' }
  ]

  return (
    <div 
      ref={studyAreaRef} 
      className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              Focus Zone
            </h1>
            <p className="text-muted-foreground">Your dedicated space for deep work and learning</p>
          </div>
          
          <div className="flex items-center gap-4">
            {sessionStats && (
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {sessionStats.currentStreak} day streak
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.round(sessionStats.totalActualMinutes / 60)}h this week
                </Badge>
              </div>
            )}
            
            <Button variant="outline" onClick={() => setShowStatsDialog(true)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </Button>
            
            <Button variant="outline" onClick={() => setShowBackgroundSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Background
            </Button>
            
            <Button variant="outline" onClick={toggleFullscreen}>
              {isFullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Session Type Selector */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant={sessionType === 'focus' ? 'default' : 'outline'}
                    onClick={() => setSessionType('focus')}
                    disabled={isActive}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Focus ({userSettings.focusSessionDuration}m)
                  </Button>
                  <Button
                    variant={sessionType === 'break' ? 'default' : 'outline'}
                    onClick={() => setSessionType('break')}
                    disabled={isActive}
                    className="flex items-center gap-2"
                  >
                    <Coffee className="h-4 w-4" />
                    Break ({userSettings.breakDuration}m)
                  </Button>
                  {userSettings.pomodoroEnabled && (
                    <Button
                      variant={sessionType === 'pomodoro' ? 'default' : 'outline'}
                      onClick={() => setSessionType('pomodoro')}
                      disabled={isActive}
                      className="flex items-center gap-2"
                    >
                      <Timer className="h-4 w-4" />
                      Pomodoro ({userSettings.pomodoroWorkDuration}m)
                    </Button>
                  )}
                </div>

                {/* Timer Display */}
                <motion.div
                  className="text-center space-y-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="text-8xl md:text-9xl font-bold font-mono text-primary tracking-wider">
                      {formatTime(minutes, seconds)}
                    </div>
                    {currentSession && (
                      <Progress 
                        value={getProgressPercentage()} 
                        className="mt-4 h-3"
                      />
                    )}
                  </div>

                  {/* Session Info */}
                  {currentSession && (
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {currentSession.plannedDuration}m planned
                      </div>
                      {interruptionCount > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          {interruptionCount} interruptions
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      onClick={toggleTimer} 
                      size="lg"
                      className="px-8"
                    >
                      {isActive ? (
                        isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />
                      ) : (
                        <Play className="h-5 w-5 mr-2" />
                      )}
                      {isActive ? (isPaused ? 'Resume' : 'Pause') : 'Start Focus'}
                    </Button>
                    
                    <Button 
                      onClick={resetTimer} 
                      variant="outline"
                      disabled={!isActive && !currentSession}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>

                    <Button
                      onClick={handleInterruption}
                      variant="outline"
                      disabled={!isActive}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mark Interruption
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Session Customization */}
            {!isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" />
                      Session Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What do you want to accomplish in this session?"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {predefinedTags.map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedTags(prev => 
                                prev.includes(tag) 
                                  ? prev.filter(t => t !== tag)
                                  : [...prev, tag]
                              )
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Music className="h-5 w-5" />
                      Ambience & Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAmbientSound(!isAmbientSoundEnabled)}
                      >
                        {isAmbientSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Select value={selectedAmbientSound} onValueChange={changeAmbientSound}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ambientSounds.map(sound => (
                            <SelectItem key={sound.value} value={sound.value}>
                              <span className="flex items-center gap-2">
                                <span>{sound.emoji}</span>
                                {sound.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {isAmbientSoundEnabled && selectedAmbientSound !== 'none' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Volume</Label>
                          <span className="text-sm text-muted-foreground">{ambientVolume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={ambientVolume}
                          onChange={(e) => changeAmbientVolume(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Background sounds can help improve focus and concentration. Audio files should be placed in /public/audio/.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            {sessionStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {sessionStats.totalSessions}
                      </div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {sessionStats.efficiency}%
                      </div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Avg. Productivity</span>
                      <span className="font-medium">{sessionStats.avgProductivity.toFixed(1)}/10</span>
                    </div>
                    <Progress value={sessionStats.avgProductivity * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {session.isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {session.sessionType === 'focus' ? 'Focus' : 
                             session.sessionType === 'break' ? 'Break' : 'Pomodoro'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.actualDuration || session.plannedDuration}m
                          </div>
                        </div>
                      </div>
                      {session.goalText && (
                        <div className="text-xs text-muted-foreground max-w-[100px] truncate">
                          {session.goalText}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sessions yet</p>
                    <p className="text-xs">Start your first focus session!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Focus Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>• Set a clear goal before starting</p>
                  <p>• Keep your phone in another room</p>
                  <p>• Take breaks every 25-90 minutes</p>
                  <p>• Use ambient sounds to maintain focus</p>
                  <p>• Track your interruptions to improve</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Background Settings Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Session Complete!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p>Great job! You completed your focus session.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>How was your productivity? (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Rate your productivity"
                  onChange={(e) => {
                    if (currentSession) {
                      setCurrentSession({
                        ...currentSession,
                        productivity: parseInt(e.target.value)
                      })
                    }
                  }}
                />
              </div>
              
              <div>
                <Label>Mood</Label>
                <Select
                  onValueChange={(value: 'excellent' | 'good' | 'average' | 'poor') => {
                    if (currentSession) {
                      setCurrentSession({
                        ...currentSession,
                        mood: value
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">😄 Excellent</SelectItem>
                    <SelectItem value="good">😊 Good</SelectItem>
                    <SelectItem value="average">😐 Average</SelectItem>
                    <SelectItem value="poor">😔 Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Session Notes</Label>
                <Textarea
                  placeholder="What did you accomplish? Any insights?"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (currentSession) {
                    saveSession({
                      ...currentSession,
                      notes: sessionNotes
                    })
                  }
                  setShowSessionDialog(false)
                  setCurrentSession(null)
                }}
                className="flex-1"
              >
                Save Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSessionDialog(false)
                  setCurrentSession(null)
                }}
              >
                Skip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Settings Dialog */}
      <Dialog open={showBackgroundSettings} onOpenChange={setShowBackgroundSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Background Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {backgroundImage && (
              <div className="space-y-2">
                <Label>Current Background</Label>
                <div className="relative">
                  <img 
                    src={backgroundImage} 
                    alt="Background preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeBackgroundImage}
                    className="absolute top-2 right-2"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Upload New Background</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP. Max size: 5MB
              </p>
            </div>
            
            {!backgroundImage && (
              <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                <div className="text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No background image set</p>
                  <p className="text-xs">Upload an image to personalize your study space</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Focus Session Analytics</DialogTitle>
          </DialogHeader>
          {sessionStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessionStats.totalSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(sessionStats.totalActualMinutes / 60)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Focus Time</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {sessionStats.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {sessionStats.longestStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Productivity Score</h3>
                <div className="flex items-center gap-2">
                  <Progress value={sessionStats.avgProductivity * 10} className="flex-1" />
                  <span className="text-sm font-medium">
                    {sessionStats.avgProductivity.toFixed(1)}/10
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Session Efficiency</h3>
                <div className="flex items-center gap-2">
                  <Progress value={sessionStats.efficiency} className="flex-1" />
                  <span className="text-sm font-medium">{sessionStats.efficiency}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  How much of your planned time you actually focused
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tab Switch Warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="border-yellow-500 bg-yellow-500/10">
              <CardContent className="p-4 flex items-center max-w-sm">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Stay Focused!</p>
                  <p className="text-sm text-muted-foreground">
                    You navigated away from your focus session.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWarning(false)}
                  className="ml-2"
                >
                  ×
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio elements */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio/session-complete.mp3" type="audio/mpeg" />
      </audio>
      
      <audio 
        ref={ambientAudioRef} 
        preload="auto"
        loop
      />
    </div>
  )
}

export default StudyAreaPage
