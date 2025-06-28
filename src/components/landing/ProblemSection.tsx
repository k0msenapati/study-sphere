"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, Brain, BookOpen } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Time-Consuming Note-Taking",
    description: "Students spend hours manually creating and organizing notes instead of focusing on understanding concepts."
  },
  {
    icon: Brain,
    title: "Lack of Personalized Learning",
    description: "One-size-fits-all study materials don't adapt to individual learning styles and pace."
  },
  {
    icon: BookOpen,
    title: "Ineffective Study Methods",
    description: "Traditional study techniques often fail to promote long-term retention and understanding."
  },
  {
    icon: AlertTriangle,
    title: "No Instant Feedback",
    description: "Students struggle without immediate guidance and feedback on their learning progress."
  }
]

export default function ProblemSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Learning Crisis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional study methods are holding students back from reaching their full potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-card p-8 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg mr-4">
                    <problem.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{problem.title}</h3>
                </div>
                <p className="text-muted-foreground">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/10 rounded-full">
            <p className="text-lg font-medium text-red-700 dark:text-red-400">
              💔 Over 70% of students struggle with these challenges daily
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
