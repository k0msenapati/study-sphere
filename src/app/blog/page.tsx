"use client";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Study Sphere Blog</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Welcome to our blog! Here you'll find student success stories, productivity tips, and the latest on AI in learning.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Blog Layout</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Featured posts at the top</li>
          <li>Categories and tags for easy navigation</li>
          <li>Author info and publish date on each post</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Writing Tone</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Friendly, encouraging, and student-focused</li>
          <li>Professional and informative</li>
        </ul>
        <div className="flex justify-center mt-8">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 