"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Flame, TrendingUp, BookOpen, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"

interface StudyStatsProps {
  stats: {
    studyStreak: number
    joinDate: Date
    totalNotes: number
    totalTasks: number
    completedTasks: number
    totalStudyTime: number // in minutes
    lastSignIn: Date | null
  }
  loading?: boolean
}

export function StudyStats({ stats, loading = false }: StudyStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const streakColor = stats.studyStreak >= 7 ? "text-orange-600" : stats.studyStreak >= 3 ? "text-yellow-600" : "text-gray-600"
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0
  const hoursStudied = Math.floor(stats.totalStudyTime / 60)
  const minutesStudied = stats.totalStudyTime % 60

  const statCards = [
    {
      title: "Study Streak",
      value: `${stats.studyStreak} days`,
      description: stats.studyStreak > 0 ? "Keep it up!" : "Start your streak today",
      icon: Flame,
      gradient: "from-orange-500 to-red-500",
      valueClass: streakColor,
    },
    {
      title: "Member Since",
      value: format(stats.joinDate, "MMM yyyy"),
      description: `${Math.floor((Date.now() - stats.joinDate.getTime()) / (1000 * 60 * 60 * 24))} days ago`,
      icon: CalendarDays,
      gradient: "from-blue-500 to-cyan-500",
      valueClass: "text-blue-600",
    },
    {
      title: "Notes Created",
      value: stats.totalNotes.toString(),
      description: "Knowledge captured",
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
      valueClass: "text-green-600",
    },
    {
      title: "Task Completion",
      value: `${completionRate}%`,
      description: `${stats.completedTasks}/${stats.totalTasks} tasks done`,
      icon: CheckCircle,
      gradient: "from-purple-500 to-violet-500",
      valueClass: "text-purple-600",
    },
    {
      title: "Study Time",
      value: hoursStudied > 0 ? `${hoursStudied}h ${minutesStudied}m` : `${minutesStudied}m`,
      description: "Total time invested",
      icon: Clock,
      gradient: "from-indigo-500 to-blue-500",
      valueClass: "text-indigo-600",
    },
    {
      title: "Last Active",
      value: stats.lastSignIn ? format(stats.lastSignIn, "MMM dd") : "Today",
      description: stats.lastSignIn ? "Last sign in" : "Currently online",
      icon: TrendingUp,
      gradient: "from-pink-500 to-rose-500",
      valueClass: "text-pink-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Study Analytics
          </CardTitle>
          <CardDescription>
            Track your learning progress and achievements over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} bg-opacity-10`}>
                        <stat.icon className={`h-5 w-5 ${stat.valueClass}`} />
                      </div>
                      {stat.title === "Study Streak" && stats.studyStreak >= 3 && (
                        <Badge variant="secondary" className="text-xs">
                          {stats.studyStreak >= 7 ? "On Fire!" : "Great!"}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className={`text-2xl font-bold ${stat.valueClass}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>

                    {/* Decorative gradient overlay */}
                    <div className={`absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-r ${stat.gradient} opacity-5 transition-all duration-300 group-hover:opacity-10 group-hover:scale-110`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Streak Motivation */}
          {stats.studyStreak === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <h4 className="font-medium text-orange-800">Start Your Study Streak!</h4>
                  <p className="text-sm text-orange-700">
                    Come back tomorrow to begin building your study streak. Consistency is key to learning success!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {stats.studyStreak >= 7 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <h4 className="font-medium text-orange-800">Amazing Streak! 🔥</h4>
                  <p className="text-sm text-orange-700">
                    You've been studying consistently for {stats.studyStreak} days. You're developing excellent learning habits!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
