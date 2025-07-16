"use client";
import Link from "next/link";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Community Guidelines</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Study Sphere is a safe, respectful, and inclusive space for all students. Please follow these guidelines to help us maintain a positive community.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Expected Behavior</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Be respectful and supportive in all interactions.</li>
          <li>No bullying, harassment, or discrimination.</li>
          <li>Do not plagiarize or copy others' work.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Reporting & Consequences</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>Report misconduct via our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.</li>
          <li>Violations may result in warnings, suspension, or removal from Study Sphere.</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 