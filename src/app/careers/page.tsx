"use client";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Careers at Study Sphere</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Join our mission to transform education with AI! We're always looking for passionate people to join our team.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Open Positions</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Design</li>
          <li>AI Research</li>
          <li>Developers</li>
          <li>EdTech Writers</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Application Form</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Name</li>
          <li>CV upload</li>
          <li>Relevant experience</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Culture & Values</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>Inclusive, collaborative, and growth-oriented</li>
          <li>Student-first mindset</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 