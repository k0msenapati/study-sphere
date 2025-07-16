"use client";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Find answers to common questions about Study Sphere, our AI features, and how to get the most out of your study experience.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">General</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>How do I create an account?</li>
          <li>Is Study Sphere free to use?</li>
          <li>How do I reset my password?</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">AI & Flashcards</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>How does AI flashcard generation work?</li>
          <li>Can I edit or delete flashcards?</li>
          <li>Is my data used to train the AI?</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Access & Progress</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>How do I save my progress?</li>
          <li>Can I export my notes or flashcards?</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Need More Help?</h2>
        <p className="mb-8 text-sm">Contact us via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link> or use the search bar above. (Suggestion: Add a search bar for instant answers.)</p>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 