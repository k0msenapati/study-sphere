"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">About Study Sphere</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Study Sphere is a student-focused platform that leverages AI to make learning smarter, easier, and more engaging.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Our Mission & Vision</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Empower students to take control of their learning journey.</li>
          <li>Make advanced study tools accessible to everyone, everywhere.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use AI in Education</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>AI flashcard generation for efficient revision.</li>
          <li>Personalized quizzes and study suggestions.</li>
          <li>AI Study Buddy for instant help and explanations.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">What Makes Us Unique?</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>Open-source, community-driven development.</li>
          <li>Focus on accessibility, privacy, and student well-being.</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 