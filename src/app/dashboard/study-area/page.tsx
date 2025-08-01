"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Timer, Zap, AlertTriangle, Expand, Shrink } from 'lucide-react'
import screenfull from 'screenfull'

const StudyAreaPage = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const studyAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setIsActive(false)
        }
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!)
    }

    return () => clearInterval(interval!)
  }, [isActive, seconds, minutes])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setShowWarning(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive])

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

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && studyAreaRef.current) {
      screenfull.toggle(studyAreaRef.current)
    }
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(25)
    setSeconds(0)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value, 10)
    if (!isNaN(newMinutes)) {
      setMinutes(newMinutes)
    }
  }

  return (
    <div ref={studyAreaRef} className="flex flex-col items-center justify-center h-full p-4 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <Zap className="mr-2 h-6 w-6 text-primary" />
              Focus Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="text-8xl font-bold font-mono text-primary">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={minutes}
                onChange={handleTimeChange}
                className="w-24 text-center"
                disabled={isActive}
              />
              <span className="text-muted-foreground">minutes</span>
            </div>
            <div className="flex space-x-4">
              <Button onClick={toggleTimer} className="w-32">
                <Timer className="mr-2 h-4 w-4" />
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={resetTimer} variant="outline">
                Reset
              </Button>
              <Button onClick={toggleFullscreen} variant="outline">
                {isFullscreen ? <Shrink className="mr-2 h-4 w-4" /> : <Expand className="mr-2 h-4 w-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4"
        >
          <Card className="border-yellow-500 bg-yellow-500/10">
            <CardContent className="p-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="font-semibold">Stay Focused!</p>
                <p className="text-sm text-muted-foreground">
                  You navigated away from the study area.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWarning(false)}
                className="ml-4"
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default StudyAreaPage
