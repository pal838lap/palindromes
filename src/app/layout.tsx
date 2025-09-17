
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { CookieWarningBanner } from "@/components/ui/cookie-warning-banner";

// Validate environment variables on app startup
if (typeof window === "undefined") {
  validateEnv();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palindromes",
  description: "A palindrome detection and analysis application built with Next.js and TypeScript.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/383new.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/383new.png", sizes: "16x16", type: "image/png" }
    ],
    apple: "/icons/383new.png",
    shortcut: "/icons/383new.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Palindromes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app-gradient`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <CookieWarningBanner />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
