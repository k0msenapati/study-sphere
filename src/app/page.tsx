"use client"

import Link from "next/link"
import SEO from "./SEO"
import LandingNavbar from "@/components/landing/LandingNavbar"
import HeroSection from "@/components/landing/HeroSection"
import VideoSection from "@/components/landing/VideoSection"
import ProblemSection from "@/components/landing/ProblemSection"
import SolutionSection from "@/components/landing/SolutionSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import CTASection from "@/components/landing/CTASection"
import LandingFooter from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Study Sphere – Revolutionize Your Study Routine"
        description="Enhance your learning with AI-powered notes, quizzes, and a personal study buddy on Study Sphere."
        url="https://study-sphere-beta.vercel.app"
        image="https://study-sphere-beta.vercel.app/og-banner.png"
      />
      <LandingNavbar />
      <HeroSection />
      <VideoSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
