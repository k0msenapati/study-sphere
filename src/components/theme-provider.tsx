"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      themes={[
        "light", 
        "dark", 
        "system"
      ]}
      storageKey="study-sphere-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
