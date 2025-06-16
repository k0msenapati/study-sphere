"use client"

import FAQ from "@/components/FAQ"
import SecondBrain from "@/components/ui/second-brain"
import Sparkles from "@/components/ui/sparkle-button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen px-4 py-16 overflow-hidden bg-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Navbar */}
      <nav className="relative mb-16 flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Study Sphere</h1>
        <Link href="/dashboard">
          <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-500 px-6 font-medium text-neutral-50">
            <span className="absolute h-56 w-32 rounded-full bg-neutral-950 transition-all duration-300 group-hover:h-0 group-hover:w-0"></span>
            <span className="relative">Study</span>
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl lg:text-6xl">
          Revolutionize Your Study Routine
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Enhance your learning experience with AI-powered notes, quizzes, and a personal study
          buddy.
        </p>
        <Link href="/dashboard">
          <SecondBrain text="Get Started Now" />
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-5xl mb-4">🤖</span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI Study Buddy</h2>
          <p className="text-gray-600">
            Chat with your personal AI study buddy for instant help, explanations, and study tips.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-5xl mb-4">📝</span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Smart Notes</h2>
          <p className="text-gray-600">
            Generate and store comprehensive notes with AI assistance. Organize and access them
            easily.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-5xl mb-4">📚</span>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Adaptive Quizzes</h2>
          <p className="text-gray-600">
            Test your knowledge with AI-generated quizzes that adapt to your learning progress.
          </p>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Study Sphere?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Boost Productivity</h3>
            <p className="text-gray-600">
              Streamline your study sessions with AI-powered tools and insights.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-gray-600">
              Enjoy a tailored study experience that adapts to your unique needs.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Resources</h3>
            <p className="text-gray-600">
              Access a wealth of AI-generated study materials and quizzes.
            </p>
          </div>
        </div>
      </section>

      <FAQ />

      {/* CTA Section */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Study Habits?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join Study Sphere today and experience a new way of learning with your personal AI study
          buddy.
        </p>
        <Link href="/dashboard">
          <Sparkles text="Join" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-sm text-gray-600">
          Made with ❤️ by{" "}
          <a href="https://github.com/kom-senapati" className="text-blue-600 hover:underline">
            kom-senapati
          </a>{" "}
          using copilotkit 🪁
        </p>
      </footer>
    </div>
  )
}
