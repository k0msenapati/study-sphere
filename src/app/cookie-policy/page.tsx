"use client";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Cookie Policy</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Study Sphere uses cookies to enhance your experience. This page explains what cookies are, how we use them, and how you can manage your preferences.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li><strong>Essential:</strong> Required for login, security, and core features.</li>
          <li><strong>Analytics:</strong> Help us understand how students use the platform.</li>
          <li><strong>Functionality:</strong> Remember your preferences and settings.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Consent Management</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>By using Study Sphere, you consent to our use of cookies.</li>
          <li>You can manage or disable cookies in your browser settings.</li>
        </ul>
        <div className="flex justify-center mt-8">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 