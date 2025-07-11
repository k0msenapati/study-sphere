"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Sun, Moon, Monitor } from "lucide-react"
import { motion } from "framer-motion"
import { useMultiTheme } from "@/lib/hooks/useMultiTheme"

export function ThemeSettings() {
  const { colorScheme, mode, setColorScheme, setMode, systemTheme, isLoading } = useMultiTheme()

  // Color schemes available
  const colorSchemes = [
    {
      name: "Winter is Coming",
      value: "winter-is-coming",
      icon: Palette,
      description: "Classic default theme with balanced colors",
    },
    {
      name: "Ill Nebulous",
      value: "ill-nebulous",
      icon: Palette,
      description: "Sophisticated earthy palette",
    },
    {
      name: "Ranksmith",
      value: "ranksmith",
      icon: Palette,
      description: "Modern theme with vibrant accents",
    },
    {
      name: "Concerned Wanderlust",
      value: "concerned-wanderlust",
      icon: Palette,
      description: "Calm teal and blue tones for focus",
    },
    {
      name: "Proud Glazed Pears",
      value: "proud-glazed-pears",
      icon: Palette,
      description: "Warm oranges and yellows for energy",
    },
  ]

  // Mode options
  const modeOptions = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      description: "Light mode for all themes",
    },
    {
      name: "Dark", 
      value: "dark",
      icon: Moon,
      description: "Dark mode for all themes",
    },
    {
      name: "System",
      value: "system", 
      icon: Monitor,
      description: "Follow your device settings",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Color Scheme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
            </CardTitle>
            <CardDescription>
              Choose your preferred color palette. Each scheme supports both light and dark modes.
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
                {colorSchemes.map((scheme) => {
                  const IconComponent = scheme.icon
                  const isSelected = colorScheme === scheme.value
                  
                  return (
                    <Button
                      key={scheme.value}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-4 justify-start text-left transition-all duration-200 ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted/50 hover:border-primary/50"
                      }`}
                      onClick={() => setColorScheme(scheme.value)}
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
                              {scheme.name}
                            </Label>
                            {isSelected && (
                              <div className={`w-2 h-2 rounded-full ${
                                isSelected 
                                  ? "bg-primary-foreground" 
                                  : "bg-primary"
                              }`} />
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${
                            isSelected 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground"
                          }`}>
                            {scheme.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance Mode
            </CardTitle>
            <CardDescription>
              Choose between light, dark, or system preference for the selected color scheme.
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
                {modeOptions.map((modeOption) => {
                  const IconComponent = modeOption.icon
                  const isSelected = mode === modeOption.value
                  const isCurrentSystemTheme = modeOption.value === "system" && systemTheme
                  
                  return (
                    <Button
                      key={modeOption.value}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-4 justify-start text-left transition-all duration-200 ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted/50 hover:border-primary/50"
                      }`}
                      onClick={() => setMode(modeOption.value)}
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
                              {modeOption.name}
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
                            {modeOption.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Theme Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Current Theme</CardTitle>
            <CardDescription>
              Preview of your selected theme combination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-md">
                  <Palette className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {colorSchemes.find(s => s.value === colorScheme)?.name} • {modeOptions.find(m => m.value === mode)?.name}
                    {mode === "system" && systemTheme && (
                      <span className="text-muted-foreground"> ({systemTheme === "dark" ? "Dark" : "Light"})</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your theme preferences are saved and will sync across all devices.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
