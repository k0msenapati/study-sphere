"use client";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Disclaimer</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Study Sphere is designed to support your learning journey. Please read this disclaimer to understand the limitations of our platform and AI features.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Educational Content</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>All content is for educational purposes only and should not be considered professional advice.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">AI Assistant Limitations</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>The AI Study Buddy provides suggestions and explanations, but may not always be accurate or up-to-date.</li>
          <li>Always verify important information independently.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Liability Waiver</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Study Sphere is not liable for any errors, omissions, or outcomes resulting from the use of our content or AI features.</li>
        </ul>
        <div className="flex justify-center mt-8">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 