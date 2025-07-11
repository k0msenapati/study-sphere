"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemePreference() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [dbTheme, setDbTheme] = useState<string | null>(null)

  // Load theme preference from database
  useEffect(() => {
    const loadThemeFromDB = async () => {
      try {
        const response = await fetch('/api/user-settings')
        if (response.ok) {
          const settings = await response.json()
          const savedTheme = settings.themePreference || 'system'
          setDbTheme(savedTheme)
          
          // Only set theme if it's different from current
          if (theme !== savedTheme) {
            setTheme(savedTheme)
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error)
        // Fallback to localStorage if DB fails
        const localTheme = localStorage.getItem('study-sphere-theme') || 'system'
        setDbTheme(localTheme)
        setTheme(localTheme)
      } finally {
        setIsLoading(false)
      }
    }

    // Only load from DB if user is likely authenticated
    // Check if we're on a dashboard page or if there's a session
    const isAuthenticated = window.location.pathname.includes('/dashboard')
    
    if (isAuthenticated) {
      loadThemeFromDB()
    } else {
      setIsLoading(false)
    }
  }, [theme, setTheme])

  // Save theme preference to database
  const saveThemePreference = async (newTheme: string) => {
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themePreference: newTheme,
        }),
      })

      if (response.ok) {
        setDbTheme(newTheme)
      } else {
        console.error('Failed to save theme preference to database')
      }
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  // Enhanced setTheme function that also saves to DB
  const setThemeWithDB = (newTheme: string) => {
    setTheme(newTheme)
    
    // Save to DB if user is authenticated
    const isAuthenticated = window.location.pathname.includes('/dashboard')
    if (isAuthenticated) {
      saveThemePreference(newTheme)
    }
  }

  return {
    theme,
    setTheme: setThemeWithDB,
    systemTheme,
    isLoading,
    dbTheme,
  }
}
