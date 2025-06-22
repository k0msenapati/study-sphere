"use client"

import { motion } from "framer-motion"
import { Bot, FileText, Brain, MessageSquare, BarChart3, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    Icon: Bot,
    name: "AI Study Buddy",
    description: "Chat with your personal AI assistant for instant help and explanations",
    className: "col-span-2 row-span-2",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    Icon: FileText,
    name: "Smart Notes",
    description: "Generate comprehensive notes automatically",
    className: "col-span-1 row-span-1",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    Icon: Brain,
    name: "Adaptive Quizzes",
    description: "AI-powered quizzes that adapt to your learning",
    className: "col-span-1 row-span-1",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    Icon: MessageSquare,
    name: "Flashcards",
    description: "Interactive flashcards for better retention",
    className: "col-span-1 row-span-1",
    gradient: "from-orange-500 to-red-500"
  },
  {
    Icon: BarChart3,
    name: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics",
    className: "col-span-2 row-span-1",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    Icon: Lightbulb,
    name: "Study Insights",
    description: "Get personalized tips to optimize your learning",
    className: "col-span-1 row-span-1",
    gradient: "from-amber-500 to-orange-500"
  }
]

const BentoCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}      className={cn(
        "group relative overflow-hidden rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300",
        feature.className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r text-white",
            feature.gradient
          )}>
            <feature.Icon className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">{feature.name}</h3>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
          {/* Decorative gradient overlay */}
        <div className={cn(
          "absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r opacity-5 transition-all duration-300 group-hover:opacity-15 group-hover:scale-110",
          feature.gradient
        )} />
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">            Powerful{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to supercharge your learning experience with AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
