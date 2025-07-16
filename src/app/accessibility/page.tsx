"use client";
import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Accessibility Statement</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Study Sphere is committed to making our platform accessible to all students. We strive to provide an inclusive and user-friendly experience for everyone.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Our Commitments</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Screen reader compatibility for all major features.</li>
          <li>High-contrast fonts and color schemes for readability.</li>
          <li>Support for keyboard navigation and language preferences.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Feedback</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>If you encounter accessibility barriers, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> so we can improve your experience.</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 