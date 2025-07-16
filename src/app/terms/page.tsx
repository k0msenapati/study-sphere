"use client";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        <p className="mb-4 text-muted-foreground text-center">
          By using Study Sphere, you agree to these terms. Please read them carefully to understand your rights and responsibilities as a student user.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Usage Rules</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Use Study Sphere for educational purposes only.</li>
          <li>Do not misuse, hack, or disrupt the platform or other users.</li>
          <li>Respect the community and follow our guidelines.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>All content, features, and code are owned by Study Sphere or its licensors.</li>
          <li>You may not copy, distribute, or use our materials without permission.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Termination & User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Accounts may be suspended or terminated for violating these terms.</li>
          <li>You are responsible for your account security and activity.</li>
        </ul>
        <div className="flex justify-center mt-8">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 