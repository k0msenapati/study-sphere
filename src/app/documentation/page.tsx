"use client";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Documentation</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Get started with Study Sphere! Here you'll find guides, feature documentation, and API references to help you make the most of our platform.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">API Overview</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Endpoints for notes, flashcards, quizzes, and more</li>
          <li>Authentication and usage examples</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Feature Documentation</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>AI Flashcard Generator</li>
          <li>Study Buddy setup</li>
          <li>Notes and quiz management</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Onboarding Guides</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>Quick start manual for new students</li>
          <li>Tips for maximizing your learning</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 