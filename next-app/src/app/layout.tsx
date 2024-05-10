import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Cinematic",
  description:
    "A movie recommendation system built on Aranzamendez, Bolito, and Rafe's enhanced Content-based Filtering.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "cinematic",
    "movie",
    "movie recommendation",
    "movie recommender",
    "content based filtering",
  ],
  authors: [
    { name: "Joshua Caleb Bolito", url: "https://jcbolito.vercel.app" },
    { name: "Aron Christoper Rafe" },
    { name: "Samantha Gwyn Aranzamendez" },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
