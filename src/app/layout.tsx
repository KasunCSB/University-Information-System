import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProductionErrorBoundary from "@/components/ProductionErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "University Information System - Connecting Sri Lankan Universities",
  description: "A free, cloud-based Learning Management System connecting all universities across Sri Lanka. Access courses, submit assignments, and collaborate from anywhere.",
  keywords: "university, LMS, sri lanka, education, learning management system",
  authors: [{ name: "UIS Development Team" }],
  openGraph: {
    title: "University Information System",
    description: "Connecting Sri Lankan Universities through technology",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProductionErrorBoundary>
          <ErrorBoundary>
            <ThemeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </ProductionErrorBoundary>
      </body>
    </html>
  );
}
