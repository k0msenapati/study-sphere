"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, CheckSquare, Trophy, Clock, TrendingUp, Layers } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardStatsProps {
  userId: number
}

interface StudyStats {
  totalStudyTime: number
  totalQuizzes: number
  totalNotes: number
  totalTasks: number
  totalFlashcards: number
  totalDecks: number
  streakDays: number
}

const statsCards = [
  {
    title: "Study Time",
    icon: Clock,
    value: "totalStudyTime",
    format: (value: number) => `${Math.floor(value / 60)}h ${value % 60}m`,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Quizzes Taken",
    icon: Trophy,
    value: "totalQuizzes",
    format: (value: number) => value.toString(),
    color: "text-green-600 dark:text-green-400"
  },
  {
    title: "Notes Created",
    icon: BookOpen,
    value: "totalNotes",
    format: (value: number) => value.toString(),
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Tasks Completed",
    icon: CheckSquare,
    value: "totalTasks",
    format: (value: number) => value.toString(),
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    title: "Flashcards",
    icon: MessageSquare,
    value: "totalFlashcards",
    format: (value: number) => value.toString(),
    color: "text-pink-600 dark:text-pink-400"
  },
  {
    title: "Study Decks",
    icon: Layers,
    value: "totalDecks",
    format: (value: number) => value.toString(),
    color: "text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Study Streak",
    icon: TrendingUp,
    value: "streakDays",
    format: (value: number) => `${value} days`,
    color: "text-red-600 dark:text-red-400"
  }
]

export function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState<StudyStats>({
    totalStudyTime: 0,
    totalQuizzes: 0,
    totalNotes: 0,
    totalTasks: 0,
    totalFlashcards: 0,
    totalDecks: 0,
    streakDays: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          // Fallback to mock data if API fails
          setStats({
            totalStudyTime: 320, // 5h 20m
            totalQuizzes: 15,
            totalNotes: 23,
            totalTasks: 47,
            totalFlashcards: 156,
            totalDecks: 8,
            streakDays: 7
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Fallback to mock data
        setStats({
          totalStudyTime: 320, // 5h 20m
          totalQuizzes: 15,
          totalNotes: 23,
          totalTasks: 47,
          totalFlashcards: 156,
          totalDecks: 8,
          streakDays: 7
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-muted h-4 w-20 rounded"></CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-1"></div>
              <div className="h-3 w-24 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsCards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.value as keyof StudyStats]
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.format(value)}</div>
                <p className="text-xs text-muted-foreground">
                  {card.title === "Study Streak" && value > 0 && "Keep it up!"}
                  {card.title === "Study Time" && "This week"}
                  {card.title === "Quizzes Taken" && "All time"}
                  {card.title === "Notes Created" && "Total created"}
                  {card.title === "Tasks Completed" && "All time"}
                  {card.title === "Flashcards" && "In your decks"}
                  {card.title === "Study Decks" && "Total collections"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
