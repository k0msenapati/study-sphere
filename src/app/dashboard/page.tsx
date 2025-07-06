"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { FeatureCards } from "@/components/dashboard/feature-cards"
import { DynamicQuote } from "@/components/dashboard/dynamic-quote"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface UserSession {
  email: string
  userId: string
}

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good Day")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good Morning")
    } else if (hour < 17) {
      setGreeting("Good Afternoon")
    } else {
      setGreeting("Good Evening")
    }

    // Get user info from session
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const session = await response.json()
          setUserEmail(session.email || "Student")
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        setUserEmail("Student")
      }
    }

    fetchUserInfo()
  }, [])

  // Extract first name from email for personalization
  const getFirstName = (email: string) => {
    if (!email) return "Student"
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {getFirstName(userEmail)}!
          </h1>
          <p className="text-muted-foreground">
            Welcome back to your learning dashboard. Here's what's happening with your studies today.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
            <p className="text-muted-foreground">Your study progress at a glance</p>
          </div>
          <DashboardStats userId={parseInt(userEmail.split('@')[0]) || 1} />
        </div>
      </motion.div>

      {/* Quote Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Daily Inspiration</CardTitle>
            <CardDescription>Stay motivated on your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicQuote />
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
            <p className="text-muted-foreground">Jump into your study tools</p>
          </div>
          <FeatureCards />
        </div>
      </motion.div>

      {/* Study Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📚</span>
              Study Tips for Success
            </CardTitle>
            <CardDescription>
              Proven strategies to enhance your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                  <div>
                    <h4 className="font-medium">Set Clear Goals</h4>
                    <p className="text-sm text-muted-foreground">Define what you want to achieve in each study session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-sm font-medium">2</span>
                  <div>
                    <h4 className="font-medium">Take Regular Breaks</h4>
                    <p className="text-sm text-muted-foreground">Use the Pomodoro technique to maintain focus</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-medium">3</span>
                  <div>
                    <h4 className="font-medium">Use Active Recall</h4>
                    <p className="text-sm text-muted-foreground">Test yourself regularly with flashcards and quizzes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-sm font-medium">4</span>
                  <div>
                    <h4 className="font-medium">Stay Organized</h4>
                    <p className="text-sm text-muted-foreground">Keep your notes and materials well-structured</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 text-sm font-medium">5</span>
                  <div>
                    <h4 className="font-medium">Find Your Environment</h4>
                    <p className="text-sm text-muted-foreground">Discover where you learn most effectively</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-sm font-medium">6</span>
                  <div>
                    <h4 className="font-medium">Practice Regularly</h4>
                    <p className="text-sm text-muted-foreground">Consistency is key to long-term retention</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400 text-sm font-medium">7</span>
                  <div>
                    <h4 className="font-medium">Stay Balanced</h4>
                    <p className="text-sm text-muted-foreground">Maintain a healthy work-life balance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm font-medium">8</span>
                  <div>
                    <h4 className="font-medium">Create a Schedule</h4>
                    <p className="text-sm text-muted-foreground">Plan your study time and stick to it</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard