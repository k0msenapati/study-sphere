"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useThemePreference } from "@/lib/hooks/useThemePreference"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggleWithDB() {
  const { setTheme, theme, isLoading } = useThemePreference()

  if (isLoading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse rounded bg-muted" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple toggle button version with DB sync
export function ThemeToggleButtonWithDB() {
  const { setTheme, theme, isLoading } = useThemePreference()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled className="h-10 w-10">
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse rounded bg-muted" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10"
      title={`Current theme: ${theme}`}
    >
      {/* Light mode icon */}
      <Sun className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all duration-300",
        theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0",
        theme !== "light" && "absolute"
      )} />
      
      {/* Dark mode icon */}
      <Moon className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all duration-300",
        theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0",
        theme !== "dark" && "absolute"
      )} />
      
      {/* System mode icon */}
      <Monitor className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all duration-300",
        theme === "system" ? "rotate-0 scale-100" : "rotate-90 scale-0",
        theme !== "system" && "absolute"
      )} />
      
      <span className="sr-only">Toggle theme (Current: {theme})</span>
    </Button>
  )
}
