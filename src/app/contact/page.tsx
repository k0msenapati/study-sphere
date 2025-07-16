"use client";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="mb-4 text-muted-foreground text-center">
          Need help or have a question? We're here for you! Reach out using the information below or use our contact form.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Support Email</h2>
        <p className="mb-4 text-sm">Email us at <a href="mailto:contact@studysphere.com" className="text-primary hover:underline">contact@studysphere.com</a></p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Form</h2>
        <p className="mb-4 text-sm">(Suggestion: Add a contact form here for general inquiries.)</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Social & Support</h2>
        <ul className="list-disc pl-6 mb-8 text-sm">
          <li>Connect with us on social media (see footer links).</li>
          <li>(Suggestion: Add a support chat widget for instant help.)</li>
        </ul>
        <div className="flex justify-center">
          <Link href="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
} 