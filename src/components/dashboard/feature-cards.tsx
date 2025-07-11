"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  MessageSquare, 
  CheckSquare, 
  CreditCard, 
  Layers, 
  BarChart3,
  User,
  Sparkles
} from "lucide-react"

const features = [
  {
    title: "Study Notes",
    description: "Create and organize your study notes with AI assistance",
    href: "/dashboard/notes",
    icon: BookOpen,
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    gradient: "from-blue-400 via-blue-500 to-blue-600"
  },
  {
    title: "AI Chat",
    description: "Get instant help from your AI study buddy",
    href: "/dashboard/chat",
    icon: MessageSquare,
    color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    gradient: "from-green-400 via-green-500 to-green-600"
  },
  {
    title: "Task Manager",
    description: "Organize your study tasks and track progress",
    href: "/dashboard/todos",
    icon: CheckSquare,
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    gradient: "from-purple-400 via-purple-500 to-purple-600"
  },
  {
    title: "Flashcards",
    description: "Create AI-powered flashcards for effective memorization",
    href: "/dashboard/flashcards",
    icon: CreditCard,
    color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    gradient: "from-pink-400 via-pink-500 to-pink-600"
  },
  {
    title: "Study Decks",
    description: "Manage your flashcard collections",
    href: "/dashboard/decks",
    icon: Layers,
    color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-400 via-indigo-500 to-indigo-600"
  },
  {
    title: "Quizzes",
    description: "Test your knowledge with interactive quizzes",
    href: "/dashboard/quizzes",
    icon: BarChart3,
    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    gradient: "from-orange-400 via-orange-500 to-orange-600"
  }
]

export function FeatureCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = feature.icon
        
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <CardDescription className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Hover effect sparkle */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </Card>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
