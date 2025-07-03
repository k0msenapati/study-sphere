"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Sun, Moon, Monitor } from "lucide-react"
import { motion } from "framer-motion"
import { useThemePreference } from "@/lib/hooks/useThemePreference"

export function ThemeSettings() {
  const { theme, setTheme, systemTheme, isLoading } = useThemePreference()

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Clean and bright interface",
    },
    {
      name: "Dark", 
      value: "dark",
      icon: Moon,
      description: "Easy on the eyes, perfect for night study",
    },
    {
      name: "System",
      value: "system", 
      icon: Monitor,
      description: "Automatically match your device settings",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Preference
          </CardTitle>
          <CardDescription>
            Choose your preferred color scheme. Your selection will be saved and synced across all your devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon
                const isSelected = theme === themeOption.value
                const isCurrentSystemTheme = themeOption.value === "system" && systemTheme
                
                return (
                  <Button
                    key={themeOption.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-auto p-4 justify-start text-left transition-all duration-200 ${
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted/50 hover:border-primary/50"
                    }`}
                    onClick={() => setTheme(themeOption.value)}
                  >
                    <div className="flex items-center w-full gap-3">
                      <div className={`p-2 rounded-md ${
                        isSelected 
                          ? "bg-primary-foreground/10" 
                          : "bg-muted"
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isSelected 
                            ? "text-primary-foreground" 
                            : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label className={`font-medium ${
                            isSelected 
                              ? "text-primary-foreground" 
                              : "text-foreground"
                          }`}>
                            {themeOption.name}
                          </Label>
                          {isSelected && (
                            <div className={`w-2 h-2 rounded-full ${
                              isSelected 
                                ? "bg-primary-foreground" 
                                : "bg-primary"
                            }`} />
                          )}
                          {isCurrentSystemTheme && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              isSelected 
                                ? "bg-primary-foreground/20 text-primary-foreground" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {systemTheme === "dark" ? "Dark" : "Light"}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${
                          isSelected 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {themeOption.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          )}
          
          {theme === "system" && systemTheme && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-muted/30 rounded-lg border border-muted"
            >
              <p className="text-sm text-muted-foreground">
                <strong>System Detection:</strong> Your device is currently using{" "}
                <span className="font-medium text-foreground">
                  {systemTheme === "dark" ? "dark" : "light"} mode
                </span>
                . The theme will automatically switch when your system settings change.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
