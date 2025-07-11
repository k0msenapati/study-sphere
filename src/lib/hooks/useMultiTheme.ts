"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface MultiThemeSettings {
  colorScheme: string
  mode: string
}

export function useMultiTheme() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [dbSettings, setDbSettings] = useState<MultiThemeSettings | null>(null)

  // Parse theme string into color scheme and mode
  const parseTheme = (themeString: string): MultiThemeSettings => {
    // Handle legacy themes
    if (themeString === "light" || themeString === "dark" || themeString === "system") {
      return {
        colorScheme: "winter-is-coming", // default color scheme
        mode: themeString
      }
    }

    // Check if it's a color scheme only (for backwards compatibility)
    const colorSchemes = ["winter-is-coming", "ill-nebulous", "ranksmith", "concerned-wanderlust", "proud-glazed-pears"]
    if (colorSchemes.includes(themeString)) {
      return {
        colorScheme: themeString,
        mode: "system" // default mode
      }
    }

    // Try to parse compound theme (format: "colorscheme:mode")
    if (themeString.includes(":")) {
      const [colorScheme, mode] = themeString.split(":")
      return {
        colorScheme: colorSchemes.includes(colorScheme) ? colorScheme : "winter-is-coming",
        mode: ["light", "dark", "system"].includes(mode) ? mode : "system"
      }
    }

    // Fallback
    return {
      colorScheme: "winter-is-coming",
      mode: "system"
    }
  }

  // Create theme string from color scheme and mode
  const createThemeString = (colorScheme: string, mode: string): string => {
    return `${colorScheme}:${mode}`
  }

  // Apply theme classes to document
  const applyThemeClasses = (colorScheme: string, mode: string) => {
    const html = document.documentElement
    
    // Remove all existing theme classes
    const allColorSchemes = ["winter-is-coming", "ill-nebulous", "ranksmith", "concerned-wanderlust", "proud-glazed-pears"]
    const allModes = ["light", "dark"]
    
    allColorSchemes.forEach(scheme => html.classList.remove(scheme))
    allModes.forEach(modeClass => html.classList.remove(modeClass))
    
    // Add color scheme class
    html.classList.add(colorScheme)
    
    // Add mode class (but not for system mode)
    if (mode === "light") {
      html.classList.add("light")
    } else if (mode === "dark") {
      html.classList.add("dark")
    }
    // For system mode, let next-themes handle it based on system preference
  }

  // Load theme preference from database
  useEffect(() => {
    const loadThemeFromDB = async () => {
      try {
        const response = await fetch('/api/user-settings')
        if (response.ok) {
          const settings = await response.json()
          const savedTheme = settings.themePreference || 'winter-is-coming:system'
          const parsedSettings = parseTheme(savedTheme)
          setDbSettings(parsedSettings)
          
          // Apply classes manually instead of using next-themes for compound themes
          applyThemeClasses(parsedSettings.colorScheme, parsedSettings.mode)
          
          // Still use next-themes for system detection
          if (parsedSettings.mode === "system") {
            setTheme("system")
          } else {
            setTheme(parsedSettings.mode)
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error)
        // Fallback to localStorage if DB fails
        const localTheme = localStorage.getItem('study-sphere-theme') || 'winter-is-coming:system'
        const parsedSettings = parseTheme(localTheme)
        setDbSettings(parsedSettings)
        applyThemeClasses(parsedSettings.colorScheme, parsedSettings.mode)
        setTheme(parsedSettings.mode === "system" ? "system" : parsedSettings.mode)
      } finally {
        setIsLoading(false)
      }
    }

    // Only load from DB if user is likely authenticated
    const isAuthenticated = window.location.pathname.includes('/dashboard')
    
    if (isAuthenticated) {
      loadThemeFromDB()
    } else {
      setIsLoading(false)
    }
  }, [setTheme])

  // Save theme preference to database
  const saveThemePreference = async (colorScheme: string, mode: string) => {
    try {
      const themeString = createThemeString(colorScheme, mode)
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themePreference: themeString,
        }),
      })

      if (response.ok) {
        setDbSettings({ colorScheme, mode })
      } else {
        console.error('Failed to save theme preference to database')
      }
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  // Set color scheme
  const setColorScheme = (colorScheme: string) => {
    const currentMode = dbSettings?.mode || "system"
    applyThemeClasses(colorScheme, currentMode)
    
    // Save to DB if user is authenticated
    const isAuthenticated = window.location.pathname.includes('/dashboard')
    if (isAuthenticated) {
      saveThemePreference(colorScheme, currentMode)
    } else {
      setDbSettings({ colorScheme, mode: currentMode })
    }
  }

  // Set mode
  const setMode = (mode: string) => {
    const currentColorScheme = dbSettings?.colorScheme || "winter-is-coming"
    applyThemeClasses(currentColorScheme, mode)
    
    // Update next-themes for system detection
    if (mode === "system") {
      setTheme("system")
    } else {
      setTheme(mode)
    }
    
    // Save to DB if user is authenticated
    const isAuthenticated = window.location.pathname.includes('/dashboard')
    if (isAuthenticated) {
      saveThemePreference(currentColorScheme, mode)
    } else {
      setDbSettings({ colorScheme: currentColorScheme, mode })
    }
  }

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (dbSettings?.mode === "system" && systemTheme) {
      applyThemeClasses(dbSettings.colorScheme, systemTheme)
    }
  }, [systemTheme, dbSettings])

  const currentSettings = dbSettings || parseTheme("winter-is-coming:system")

  return {
    colorScheme: currentSettings.colorScheme,
    mode: currentSettings.mode,
    setColorScheme,
    setMode,
    systemTheme,
    isLoading,
  }
}
