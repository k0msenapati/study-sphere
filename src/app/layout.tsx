import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { ThemeProvider } from "@/components/theme-provider";

// ✅ Import QuizProvider
import { QuizProvider } from "@/context/QuizProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Study-Sphere",
  description: "A platform for collaborative learning and knowledge sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {/* ✅ Wrap app in QuizProvider here */}
          <QuizProvider>
            {children}
            <ScrollToTopButton />
          </QuizProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
