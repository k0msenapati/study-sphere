"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function DashboardThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    // If current theme is system, switch to the opposite of what system resolved to
    if (theme === "system") {
      setTheme(resolvedTheme === "light" ? "dark" : "light")
    } else {
      // Otherwise toggle between light and dark
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  // Determine which icon to show based on resolved theme
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 