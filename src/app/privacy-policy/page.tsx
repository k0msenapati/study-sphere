"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Welcome to Study Sphere! We are committed to protecting your privacy and ensuring a safe, student-friendly experience. This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Collect and Use Data</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Personal information (like email) is collected during registration and account management.</li>
          <li>Usage data (such as study activity, flashcard creation, quiz results) is used to improve your learning experience.</li>
          <li>We do <strong>not</strong> sell or share your personal data with third parties for marketing.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Cookie Usage & Third-Party Services</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Essential cookies are used for login and session management.</li>
          <li>Analytics cookies help us understand how students use Study Sphere, so we can improve features.</li>
          <li>Some third-party services (like analytics providers) may collect anonymized usage data.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Data Retention & Opt-Out</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Your data is retained as long as your account is active or as required by law.</li>
          <li>You can request data deletion or export at any time by contacting us.</li>
          <li>To opt out of analytics, adjust your cookie preferences in your browser settings.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights & Contact</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>You have the right to access, correct, or delete your personal data.</li>
          <li>For privacy questions, email <a href="mailto:contact@studysphere.com" className="text-primary hover:underline">contact@studysphere.com</a>.</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 