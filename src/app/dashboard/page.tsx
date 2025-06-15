"use client"

import { motion } from "framer-motion"
import FAQ from "@/components/FAQ"
import SecondBrain from "@/components/ui/second-brain"
import Sparkles from "@/components/ui/sparkle-button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen px-4 py-16 overflow-hidden bg-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {/* Navbar */}
      <nav className="relative mb-16 flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Study Sphere</h1>
        <Link
          href="/dashboard"
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-500 px-6 font-medium text-neutral-50"
        >
          <span className="absolute h-56 w-32 rounded-full bg-neutral-950 transition-all duration-300 group-hover:h-0 group-hover:w-0"></span>
          <span className="relative">Study</span>
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
        {["🤖", "📝", "📚"].map((emoji, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-5xl mb-4">{emoji}</span>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {idx === 0 ? "AI Study Buddy" : idx === 1 ? "Smart Notes" : "Adaptive Quizzes"}
            </h2>
            <p className="text-gray-600">
              {idx === 0
                ? "Chat with your personal AI study buddy for instant help, explanations, and study tips."
                : idx === 1
                  ? "Generate and store comprehensive notes with AI assistance. Organize and access them easily."
                  : "Test your knowledge with AI-generated quizzes that adapt to your learning progress."}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Benefits Section */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Study Sphere?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Icon + Heading + Text... */}
          {/* Repeat similar blocks */}
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
